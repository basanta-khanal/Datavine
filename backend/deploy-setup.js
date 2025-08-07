const { sequelize } = require('./config/database');
const User = require('./models/User');
const Assessment = require('./models/Assessment');

async function deploySetup() {
  try {
    console.log('🚀 Railway deployment setup starting...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ alter: true }); // Use alter instead of force for production
    console.log('✅ Database tables synchronized');
    
    // Create indexes for better performance
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON "Users" (email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON "Users" ("googleId");
      CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON "Assessments" ("userId");
      CREATE INDEX IF NOT EXISTS idx_assessments_test_type ON "Assessments" ("testType");
      CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON "Assessments" ("createdAt");
    `);
    console.log('✅ Database indexes created');
    
    console.log('\n🎉 Railway deployment setup completed successfully!');
    console.log('\n📋 Database ready for production use');
    
  } catch (error) {
    console.error('❌ Railway deployment setup failed:', error.message);
    console.log('\n💡 This might be normal if database is already set up');
    console.log('   Continuing with deployment...');
  } finally {
    // Don't close the connection in production - let the app use it
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.close();
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  deploySetup();
}

module.exports = deploySetup; 