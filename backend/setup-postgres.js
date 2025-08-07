const { sequelize } = require('./config/database');
const User = require('./models/User');
const Assessment = require('./models/Assessment');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up PostgreSQL database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: true }); // force: true will drop existing tables
    console.log('✅ Database tables created successfully');
    
    // Create indexes for better performance
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON "Users" (email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON "Users" ("googleId");
      CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON "Assessments" ("userId");
      CREATE INDEX IF NOT EXISTS idx_assessments_test_type ON "Assessments" ("testType");
      CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON "Assessments" ("createdAt");
    `);
    console.log('✅ Database indexes created');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Tables created:');
    console.log('   - Users (with all user fields)');
    console.log('   - Assessments (with all assessment fields)');
    console.log('\n🔗 Relationships:');
    console.log('   - User has many Assessments');
    console.log('   - Assessment belongs to User');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure PostgreSQL is running');
    console.log('   2. Check your DATABASE_URL in environment variables');
    console.log('   3. Ensure the database exists');
    console.log('   4. Verify your PostgreSQL credentials');
  } finally {
    await sequelize.close();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 