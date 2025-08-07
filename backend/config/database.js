const { Sequelize } = require('sequelize');

// PostgreSQL Configuration
const getDatabaseUrl = () => {
  // Check for Railway's variable reference format
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (dbUrl && dbUrl.includes('${{')) {
    console.log('⚠️  Railway variable reference detected but not resolved');
    console.log('   Make sure the variable reference is set up correctly in Railway');
    // Don't return null - let Sequelize try to connect anyway
    // Railway should resolve the variable at runtime
  }
  
  return dbUrl || 'postgresql://localhost:5432/datavine';
};

const sequelize = new Sequelize(getDatabaseUrl(), {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  retry: {
    max: 3,
    timeout: 10000
  }
});

const connectDB = async () => {
  try {
    console.log('Attempting to connect to PostgreSQL...');
    
    // Log connection attempt details
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (dbUrl) {
      if (dbUrl.includes('${{')) {
        console.log(' Railway variable reference detected: ${{ Postgres.DATABASE_URL }}');
      } else {
        const maskedUrl = dbUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
        console.log('Database URL (masked):', maskedUrl);
      }
    } else {
      console.log('No DATABASE_URL found, using fallback');
    }
    
    await sequelize.authenticate();
    console.log('📦 PostgreSQL Connected successfully');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('📋 Database models synchronized');
    
    // Handle connection events
    sequelize.addHook('afterConnect', (connection) => {
      console.log('New database connection established');
    });

    // Handle connection errors
    sequelize.addHook('afterDisconnect', (connection) => {
      console.log('Database connection disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await sequelize.close();
        console.log('PostgreSQL connection closed through app termination');
      } catch (error) {
        console.log('Error closing database connection:', error.message);
      }
      process.exit(0);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    
    // Only fallback to in-memory in development
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Falling back to in-memory database for development');
      const inMemoryDB = {
        users: new Map(),
        assessments: new Map(),
        sessions: new Map()
      };
      global.inMemoryDB = inMemoryDB;
      return false;
    } else {
      // In production, throw the error
      throw error;
    }
  }
};

module.exports = { connectDB, sequelize }; 