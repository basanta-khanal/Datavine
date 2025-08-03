const mongoose = require('mongoose');

// In-memory storage for development
const inMemoryDB = {
  users: new Map(),
  assessments: new Map(),
  sessions: new Map()
};

const connectDB = async () => {
  // Always initialize in-memory database for development
  global.inMemoryDB = inMemoryDB;
  
  try {
    // Check if MongoDB URI is provided
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/datavine';
    
    console.log('Attempting to connect to MongoDB...');
    
    // Try to connect to MongoDB
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      });
      
    } catch (mongoError) {
      console.log('⚠️  MongoDB not available, using in-memory database for development');
      console.log('💡 For production, please set up MongoDB or use MongoDB Atlas');
    }

  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('⚠️  Using in-memory database for development');
  }
};

module.exports = connectDB; 