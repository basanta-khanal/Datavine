const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const assessmentRoutes = require('./routes/assessments');
const paymentRoutes = require('./routes/payments');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet());
app.use(compression());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://datavine-ai.vercel.app',
  'https://datavine.vercel.app',
  'https://datavine-git-main-basanta-khanal.vercel.app',
  'https://datavine-basanta-khanal.vercel.app',
  'https://data-vine-d76w6d66e-basanta-khanals-projects.vercel.app',
  'https://data-vine-gef94j8pk-basanta-khanals-projects.vercel.app',
  'https://datavibe.com'
];

// Add FRONTEND_URL to allowed origins if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS request from origin:', origin);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // In development, allow all origins for easier testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Allowing all origins in development');
      return callback(null, true);
    }
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('Origin allowed from allowedOrigins list:', origin);
      callback(null, true);
    } 
    // Allow any Vercel domain in production
    else if (process.env.NODE_ENV === 'production' && origin.includes('vercel.app')) {
      console.log('Allowing Vercel domain:', origin);
      callback(null, true);
    }
    // Allow datavine.ai domain
    else if (origin === 'https://datavibe.com') {
      console.log('Allowing datavibe.com domain:', origin);
      callback(null, true);
    }
    else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      // In production, be more strict
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        // In development, allow it anyway
        console.log('Allowing blocked origin in development');
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check Route (must be before rate limiting)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Datavibe Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint for Railway health checks
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Datavibe Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rate Limiting (after health check)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs (increased for testing)
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Less restrictive rate limiting for forgot password
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 forgot password requests per windowMs
  message: {
    success: false,
    message: 'Too many password reset requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
app.use('/api/auth/forgot-password', forgotPasswordLimiter);
app.use('/api/auth', authLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Datavibe Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  
  // Signal that the server is ready
  if (process.send) {
    process.send('ready');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app; 