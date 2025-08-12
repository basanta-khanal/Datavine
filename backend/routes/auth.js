const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const User = require('../models/User');
const emailService = require('../services/email');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
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

    const { name, email, password, phone, gender } = req.body;

    // Check if using in-memory database
    if (global.inMemoryDB) {
      // Check if user already exists in memory
      const existingUser = Array.from(global.inMemoryDB.users.values()).find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user in memory
      const userId = Date.now().toString();
      const user = {
        id: userId,
        name,
        email,
        password: hashedPassword,
        phone,
        gender,
        isSubscribed: false,
        subscriptionType: 'free',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      global.inMemoryDB.users.set(userId, user);

      // Generate token
      const token = generateToken(userId);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          isSubscribed: user.isSubscribed,
          subscriptionType: user.subscriptionType,
          createdAt: user.createdAt
        }
      });
    } else {
      // Use Sequelize database
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone,
        gender
      });

      const token = generateToken(user.id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: user.toPublicJSON()
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'SequelizeConnectionError' || error.message.includes('connection manager was closed')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

    const { email, password } = req.body;

    // Check if using in-memory database
    if (global.inMemoryDB) {
      // Find user in memory
      const user = Array.from(global.inMemoryDB.users.values()).find(u => u.email === email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      user.lastLoginAt = new Date();
      global.inMemoryDB.users.set(user.id, user);

      // Generate token
      const token = generateToken(user.id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          isSubscribed: user.isSubscribed,
          subscriptionType: user.subscriptionType,
          createdAt: user.createdAt
        }
      });
    } else {
      // Use Sequelize database
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      // Generate token
      const token = generateToken(user.id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: user.toPublicJSON()
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.name === 'SequelizeConnectionError' || error.message.includes('connection manager was closed')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', async (req, res) => {
  try {
    // Clear cookie if it exists
    res.clearCookie('token');
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');
    
    // Check if using in-memory database
    if (global.inMemoryDB) {
      // Find user in memory
      const user = global.inMemoryDB.users.get(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          isSubscribed: user.isSubscribed,
          subscriptionType: user.subscriptionType,
          createdAt: user.createdAt
        }
      });
    } else {
      // Use Sequelize database
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: user.toPublicJSON()
      });
    }

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
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

    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    // Don't reveal if user exists or not for security
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token in user data
    await user.update({
      resetToken,
      resetTokenExpiry
    });

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL || 'https://datavine.com'}/reset-password?token=${resetToken}`;
    
    // Try to send email
    let emailSent = false;
    try {
      await emailService.sendPasswordResetEmail(email, resetLink);
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Continue without failing the request
    }

    // Only log reset link in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Password reset token for ${email}: ${resetToken}`);
      console.log(`Reset link: ${resetLink}`);
    }

    // Send response
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      ...(process.env.NODE_ENV === 'development' && !emailSent && { resetLink })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
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

    const { token, newPassword } = req.body;

    // Find user with this reset token
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          [Sequelize.Op.gt]: new Date() // Token not expired
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update user password and clear reset token
    await user.update({
      password: newPassword, // Will be hashed by model hook
      resetToken: null,
      resetTokenExpiry: null
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth login (simulated for development)
// @access  Public
router.post('/google', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('googleId')
    .notEmpty()
    .withMessage('Google ID is required')
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

    const { email, name, googleId, profilePicture } = req.body;
    
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Create new user from Google data
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture
      });
    } else {
      // Update existing user with Google data
      await user.update({
        googleId,
        name,
        profilePicture,
        lastLoginAt: new Date()
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google login'
    });
  }
});

module.exports = router; 