const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Food = require('../models/Food');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all available food (with filters and pagination)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn([
    'fruits', 'vegetables', 'grains', 'protein', 'dairy', 
    'prepared-meals', 'baked-goods', 'beverages', 'pantry-items', 'other'
  ]).withMessage('Invalid category'),
  query('lat').optional().isFloat().withMessage('Latitude must be a number'),
  query('lng').optional().isFloat().withMessage('Longitude must be a number'),
  query('radius').optional().isInt({ min: 1, max: 50 }).withMessage('Radius must be between 1 and 50 km')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {
      status: 'available',
      'availability.availableUntil': { $gte: new Date() }
    };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Location-based search
    if (req.query.lat && req.query.lng) {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      const radius = parseInt(req.query.radius) || 10; // Default 10km

      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius * 1000 // Convert to meters
        }
      };
    }

    // Text search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Dietary filters
    const dietaryFilters = ['isVegetarian', 'isVegan', 'isHalal', 'isKosher', 'isGlutenFree'];
    dietaryFilters.forEach(filter => {
      if (req.query[filter] === 'true') {
        query[`dietary.${filter}`] = true;
      }
    });

    const food = await Food.find(query)
      .populate('donor', 'name avatar rating location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Food.countDocuments(query);

    res.json({
      success: true,
      data: food,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single food item
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('donor', 'name avatar rating location bio stats');

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Increment view count
    food.views += 1;
    await food.save();

    res.json({
      success: true,
      data: food
    });

  } catch (error) {
    console.error('Get food by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new food listing
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn([
    'fruits', 'vegetables', 'grains', 'protein', 'dairy', 
    'prepared-meals', 'baked-goods', 'beverages', 'pantry-items', 'other'
  ]).withMessage('Invalid category'),
  body('quantity.amount').isInt({ min: 1 }).withMessage('Quantity amount must be at least 1'),
  body('quantity.unit').isIn(['servings', 'pounds', 'kilograms', 'pieces', 'containers', 'other']).withMessage('Invalid quantity unit'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [longitude, latitude]'),
  body('location.address').trim().isLength({ min: 5 }).withMessage('Address is required'),
  body('availability.availableUntil').isISO8601().withMessage('Available until date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const foodData = {
      ...req.body,
      donor: req.user.userId
    };

    const food = new Food(foodData);
    await food.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.activeListings': 1 }
    });

    const populatedFood = await Food.findById(food._id)
      .populate('donor', 'name avatar rating location');

    res.status(201).json({
      success: true,
      message: 'Food listing created successfully',
      data: populatedFood
    });

  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update food listing
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('quantity.amount').optional().isInt({ min: 1 }).withMessage('Quantity amount must be at least 1'),
  body('availability.availableUntil').optional().isISO8601().withMessage('Available until date must be valid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check if user owns this food listing
    if (food.donor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    // Don't allow updates if food is reserved or completed
    if (food.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update listing that is not available'
      });
    }

    // Update allowed fields
    const allowedFields = ['title', 'description', 'quantity', 'availability', 'dietary', 'notes', 'tags'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    Object.assign(food, updates);
    await food.save();

    const updatedFood = await Food.findById(food._id)
      .populate('donor', 'name avatar rating location');

    res.json({
      success: true,
      message: 'Food listing updated successfully',
      data: updatedFood
    });

  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete food listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check if user owns this food listing
    if (food.donor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    // Don't allow deletion if food is reserved (unless cancelling)
    if (food.status === 'reserved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete reserved listing. Cancel the reservation first.'
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    // Update user stats
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.activeListings': -1 }
    });

    res.json({
      success: true,
      message: 'Food listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Save/unsave food item
router.post('/:id/save', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    const userId = req.user.userId;
    const isSaved = food.saves.includes(userId);

    if (isSaved) {
      // Unsave
      food.saves = food.saves.filter(id => id.toString() !== userId);
    } else {
      // Save
      food.saves.push(userId);
    }

    await food.save();

    res.json({
      success: true,
      message: isSaved ? 'Food item unsaved' : 'Food item saved',
      saved: !isSaved
    });

  } catch (error) {
    console.error('Save food error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;