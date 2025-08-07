const { Sequelize } = require('sequelize');

// PostgreSQL Configuration
const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://localhost:5432/datavine', {
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
  }
});

const connectDB = async () => {
  try {
    console.log('Attempting to connect to PostgreSQL...');
    
    await sequelize.authenticate();
    console.log('📦 PostgreSQL Connected successfully');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('📋 Database models synchronized');
    
    // Handle connection events
    sequelize.addHook('afterConnect', (connection) => {
      console.log('New database connection established');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await sequelize.close();
      console.log('PostgreSQL connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    console.log('⚠️  Falling back to in-memory database for development');
    
    // Fallback to in-memory database for development
    const inMemoryDB = {
      users: new Map(),
      assessments: new Map(),
      sessions: new Map()
    };
    global.inMemoryDB = inMemoryDB;
  }
};

module.exports = { connectDB, sequelize }; 