const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

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

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user (password will be hashed automatically by the model hook)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      gender
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific database connection errors
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

    // Find user
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

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific database connection errors
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
    
    // Find user by ID
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
    const resetLink = `${process.env.FRONTEND_URL || 'https://datavibe.com'}/reset-password?token=${resetToken}`;
    
    // Try to send email if email service is configured
    let emailSent = false;
    try {
      if (process.env.EMAIL_SERVICE_ENABLED === 'true' && process.env.SMTP_HOST && process.env.SMTP_USER) {
        // Configure nodemailer with SMTP settings
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        // Email template
        const mailOptions = {
                  from: process.env.SMTP_FROM || 'Datavibe <noreply@datavibe.com>',
        to: email,
        subject: 'Password Reset Request - Datavibe',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                              <h2 style="color: #374151;">Password Reset Request</h2>
              <p>You requested a password reset for your Datavibe account.</p>
              <p>Click the button below to reset your password:</p>
                              <a href="${resetLink}" style="display: inline-block; background-color: #374151; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetLink}</p>
              <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
            </div>
          `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`Password reset email sent to: ${email}`);
      }
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Continue without failing the request
    }

    // Log the reset link for development or if email failed
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: ${resetLink}`);

    // Determine response message
    let message;
    if (emailSent) {
      message = 'A password reset link has been sent to your email address.';
    } else if (process.env.NODE_ENV === 'development') {
      message = `Password reset link generated. Check server console for: ${resetLink}`;
    } else {
      message = 'If an account with that email exists, a password reset link has been sent. Check server console for the link (email service not configured).';
    }
    
    res.json({
      success: true,
      message,
      resetLink: (!emailSent && process.env.NODE_ENV === 'development') ? resetLink : undefined
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