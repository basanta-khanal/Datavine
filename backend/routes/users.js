const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    // Remove password from response
    const { password: _, ...userResponse } = req.user;

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
router.put('/profile', protect, [
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

    const { name, phone, gender, dateOfBirth } = req.body;

    // Update user fields
    if (name) req.user.name = name;
    if (phone) req.user.phone = phone;
    if (gender) req.user.gender = gender;
    if (dateOfBirth) req.user.dateOfBirth = dateOfBirth;
    
    req.user.updatedAt = new Date().toISOString();

    // Save the updated user
    await req.user.save();

    // Remove password from response
    const { password: _, ...userResponse } = req.user;

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
router.post('/upload-profile-picture', protect, async (req, res) => {
  try {
    // For now, we'll simulate a profile picture upload
    // In production, you'd upload to Cloudinary or similar service
    const profilePictureUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(req.user.name)}&background=007bff&color=ffffff&size=150`;
    
    req.user.profilePicture = profilePictureUrl;
    req.user.updatedAt = new Date().toISOString();

    // Save the updated user
    await req.user.save();

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