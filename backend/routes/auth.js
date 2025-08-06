const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

    // Use in-memory database
    const users = global.inMemoryDB?.users || new Map();
    
    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = Date.now().toString();
    const user = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      profilePicture: null,
      isSubscribed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store user
    users.set(email, user);

    // Generate token
    const token = generateToken(userId);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
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

    // Use in-memory database
    const users = global.inMemoryDB?.users || new Map();
    
    // Find user
    const user = users.get(email);
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

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
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
    
    // Use in-memory database
    const users = global.inMemoryDB?.users || new Map();
    
    // Find user by ID
    let user = null;
    for (const [email, userData] of users) {
      if (userData.id === decoded.id) {
        user = userData;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      user: userResponse
    });

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

    // Use in-memory database
    const users = global.inMemoryDB?.users || new Map();
    
    // Check if user exists
    if (!users.has(email)) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token in user data
    const user = users.get(email);
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    users.set(email, user);

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL || 'https://datavine.ai'}/reset-password?token=${resetToken}`;
    
    // In production, you would send an email here
    // For now, we'll just log the token and provide it in response for development
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: ${resetLink}`);

    // For development, include the reset link in the response
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.json({
      success: true,
      message: isDevelopment 
        ? `Password reset link generated. Check server console for: ${resetLink}`
        : 'If an account with that email exists, a password reset link has been sent.',
      resetLink: isDevelopment ? resetLink : undefined
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

    // Use in-memory database
    const users = global.inMemoryDB?.users || new Map();
    
    // Find user with this reset token
    let user = null;
    let userEmail = null;
    
    for (const [email, userData] of users) {
      if (userData.resetToken === token && userData.resetTokenExpiry > new Date()) {
        user = userData;
        userEmail = email;
        break;
      }
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.updatedAt = new Date().toISOString();
    
    users.set(userEmail, user);

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

    const { email, name, googleId } = req.body;
    const users = global.inMemoryDB?.users || new Map();
    
    let user = users.get(email);
    
    if (!user) {
      // Create new user from Google data
      const userId = Date.now().toString();
      user = {
        id: userId,
        name,
        email,
        googleId,
        profilePicture: null,
        isSubscribed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.set(email, user);
    } else {
      // Update existing user with Google data
      user.googleId = googleId;
      user.name = name;
      user.updatedAt = new Date().toISOString();
      users.set(email, user);
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove sensitive data from response
    const { password, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: userResponse
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