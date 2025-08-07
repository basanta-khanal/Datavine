const { Sequelize } = require('sequelize');

async function debugConnection() {
  console.log('🔍 Debugging PostgreSQL connection...');
  
  // Log environment variables (without sensitive data)
  console.log('Environment check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('- POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
  
  if (process.env.DATABASE_URL) {
    // Mask the password in the URL for logging
    const maskedUrl = process.env.DATABASE_URL.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    console.log('- DATABASE_URL (masked):', maskedUrl);
  }
  
  // Try to create a test connection
  try {
    const testSequelize = new Sequelize(process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://localhost:5432/datavine', {
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    });
    
    console.log('🔗 Attempting to connect...');
    await testSequelize.authenticate();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    const result = await testSequelize.query('SELECT NOW() as current_time');
    console.log('✅ Query test successful:', result[0][0]);
    
    await testSequelize.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
    
    // Provide specific troubleshooting steps
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if DATABASE_URL is set in Railway environment variables');
    console.log('2. Verify the PostgreSQL service is running in Railway');
    console.log('3. Check if the connection string format is correct');
    console.log('4. Ensure SSL settings are appropriate for Railway');
  }
}

// Run debug if this file is executed directly
if (require.main === module) {
  debugConnection();
}

module.exports = debugConnection; 