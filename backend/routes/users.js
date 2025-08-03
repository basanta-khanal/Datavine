const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to get user from token
const getUserFromToken = (req) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');
    const users = global.inMemoryDB?.users || new Map();
    
    for (const [email, userData] of users) {
      if (userData.id === decoded.id) {
        return userData;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors.array()
      });
    }

    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { name, phone, gender, dateOfBirth } = req.body;

    // Update user fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    
    user.updatedAt = new Date().toISOString();

    // Update in storage
    const users = global.inMemoryDB?.users || new Map();
    users.set(user.email, user);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// @route   POST /api/users/upload-profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/upload-profile-picture', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // For now, we'll simulate a profile picture upload
    // In production, you'd upload to Cloudinary or similar service
    const profilePictureUrl = `https://via.placeholder.com/150/007bff/ffffff?text=${user.name.charAt(0).toUpperCase()}`;
    
    user.profilePicture = profilePictureUrl;
    user.updatedAt = new Date().toISOString();

    // Update in storage
    const users = global.inMemoryDB?.users || new Map();
    users.set(user.email, user);

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        url: profilePictureUrl
      }
    });

  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
});

module.exports = router; 