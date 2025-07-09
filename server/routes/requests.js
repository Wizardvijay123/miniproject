const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const Food = require('../models/Food');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new request
router.post('/', auth, [
  body('food').isMongoId().withMessage('Valid food ID is required'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message must be less than 500 characters')
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

    const { food: foodId, message } = req.body;
    const requesterId = req.user.userId;

    // Check if food exists and is available
    const food = await Food.findById(foodId).populate('donor');
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    if (!food.isAvailable()) {
      return res.status(400).json({
        success: false,
        message: 'Food item is not available'
      });
    }

    // Check if user is not requesting their own food
    if (food.donor._id.toString() === requesterId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot request your own food'
      });
    }

    // Check if user has already requested this food
    const existingRequest = await Request.findOne({
      food: foodId,
      requester: requesterId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested this food item'
      });
    }

    // Create new request
    const request = new Request({
      food: foodId,
      requester: requesterId,
      donor: food.donor._id,
      message,
      location: food.location
    });

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('food', 'title images quantity category')
      .populate('requester', 'name avatar rating')
      .populate('donor', 'name avatar rating');

    res.status(201).json({
      success: true,
      message: 'Request sent successfully',
      data: populatedRequest
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get current user's requests (sent)
router.get('/sent', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await Request.find({ requester: req.user.userId })
      .populate('food', 'title images quantity category status')
      .populate('donor', 'name avatar rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments({ requester: req.user.userId });

    res.json({
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get current user's requests (received)
router.get('/received', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await Request.find({ donor: req.user.userId })
      .populate('food', 'title images quantity category status')
      .populate('requester', 'name avatar rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments({ donor: req.user.userId });

    res.json({
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Accept a request
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('food')
      .populate('requester', 'name avatar rating');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the donor
    if (request.donor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request'
      });
    }

    // Check if request is pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not pending'
      });
    }

    // Check if food is still available
    if (!request.food.isAvailable()) {
      return res.status(400).json({
        success: false,
        message: 'Food is no longer available'
      });
    }

    // Accept the request and reserve the food
    await request.accept();
    await request.food.reserve(request.requester._id);

    // Decline all other pending requests for this food
    await Request.updateMany(
      {
        food: request.food._id,
        status: 'pending',
        _id: { $ne: request._id }
      },
      { status: 'declined' }
    );

    const updatedRequest = await Request.findById(request._id)
      .populate('food', 'title images quantity category')
      .populate('requester', 'name avatar rating')
      .populate('donor', 'name avatar rating');

    res.json({
      success: true,
      message: 'Request accepted successfully',
      data: updatedRequest
    });

  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Decline a request
router.put('/:id/decline', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the donor
    if (request.donor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to decline this request'
      });
    }

    // Check if request is pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not pending'
      });
    }

    await request.decline();

    const updatedRequest = await Request.findById(request._id)
      .populate('food', 'title images quantity category')
      .populate('requester', 'name avatar rating')
      .populate('donor', 'name avatar rating');

    res.json({
      success: true,
      message: 'Request declined',
      data: updatedRequest
    });

  } catch (error) {
    console.error('Decline request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Complete a request
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('food');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is either donor or requester
    const userId = req.user.userId;
    if (request.donor.toString() !== userId && request.requester.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this request'
      });
    }

    // Check if request is accepted
    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Request must be accepted before completion'
      });
    }

    // Complete the request and food transaction
    await request.complete();
    await request.food.complete();

    // Update user stats
    await User.findByIdAndUpdate(request.donor, {
      $inc: { 
        'stats.foodShared': 1,
        'stats.activeListings': -1
      }
    });

    await User.findByIdAndUpdate(request.requester, {
      $inc: { 'stats.foodReceived': 1 }
    });

    const updatedRequest = await Request.findById(request._id)
      .populate('food', 'title images quantity category')
      .populate('requester', 'name avatar rating')
      .populate('donor', 'name avatar rating');

    res.json({
      success: true,
      message: 'Transaction completed successfully',
      data: updatedRequest
    });

  } catch (error) {
    console.error('Complete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add message to request
router.post('/:id/message', auth, [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
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

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is part of this request
    const userId = req.user.userId;
    if (request.donor.toString() !== userId && request.requester.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to message in this request'
      });
    }

    await request.addMessage(userId, req.body.message);

    const updatedRequest = await Request.findById(request._id)
      .populate('communication.sender', 'name avatar')
      .populate('food', 'title')
      .populate('requester', 'name avatar')
      .populate('donor', 'name avatar');

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: updatedRequest
    });

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;