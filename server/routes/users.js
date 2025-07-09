const express = require('express');
const User = require('../models/User');
const Food = require('../models/Food');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user's food listings
router.get('/:id/food', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const food = await Food.find({ 
      donor: req.params.id,
      status: { $in: ['available', 'reserved'] }
    })
    .populate('donor', 'name avatar rating')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Food.countDocuments({ 
      donor: req.params.id,
      status: { $in: ['available', 'reserved'] }
    });

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
    console.error('Get user food error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get current user's saved food items
router.get('/me/saved', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const food = await Food.find({ 
      saves: req.user.userId,
      status: 'available'
    })
    .populate('donor', 'name avatar rating location')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Food.countDocuments({ 
      saves: req.user.userId,
      status: 'available'
    });

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
    console.error('Get saved food error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get current user's food history
router.get('/me/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const type = req.query.type; // 'donated' or 'received'

    let query = {};

    if (type === 'donated') {
      query = { donor: req.user.userId };
    } else if (type === 'received') {
      query = { reservedBy: req.user.userId };
    } else {
      // Both donated and received
      query = {
        $or: [
          { donor: req.user.userId },
          { reservedBy: req.user.userId }
        ]
      };
    }

    // Only completed or cancelled transactions
    query.status = { $in: ['completed', 'cancelled'] };

    const food = await Food.find(query)
      .populate('donor', 'name avatar rating')
      .populate('reservedBy', 'name avatar rating')
      .sort({ updatedAt: -1 })
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
    console.error('Get user history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user location
router.put('/me/location', auth, async (req, res) => {
  try {
    const { coordinates, address } = req.body;

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Valid coordinates [longitude, latitude] are required'
      });
    }

    if (!address || typeof address !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        location: {
          type: 'Point',
          coordinates,
          address
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;