const { Sequelize } = require('sequelize');

async function testRailwayDeployment() {
  console.log('🚂 Railway Deployment Test');
  console.log('==========================');
  
  // Environment check
  console.log('\n📋 Environment Variables:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('- POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
  
  // Check DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    if (dbUrl.includes('${{')) {
      console.log('- DATABASE_URL format: Railway variable reference');
      console.log('- Variable reference:', dbUrl);
      
      // Check if it's a valid Railway format
      if (dbUrl.includes('Postgres.DATABASE_URL')) {
        console.log('✅ Valid Railway PostgreSQL reference format');
      } else {
        console.log('⚠️  Check service name in variable reference');
      }
    } else if (dbUrl.startsWith('postgresql://')) {
      console.log('- DATABASE_URL format: Direct connection string');
      const maskedUrl = dbUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
      console.log('- Connection string (masked):', maskedUrl);
    } else {
      console.log('⚠️  Unknown DATABASE_URL format');
    }
  } else {
    console.log('❌ No DATABASE_URL found');
  }
  
  // Test connection
  console.log('\n🔗 Testing Database Connection...');
  
  try {
    // Create test connection
    const testSequelize = new Sequelize(dbUrl || 'postgresql://localhost:5432/datavine', {
      dialect: 'postgres',
      logging: false,
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
    
    console.log('Attempting to connect...');
    await testSequelize.authenticate();
    console.log('✅ Connection successful!');
    
    // Test query
    const result = await testSequelize.query('SELECT version() as version');
    console.log('✅ Query test successful');
    console.log('- PostgreSQL version:', result[0][0].version);
    
    await testSequelize.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Provide specific troubleshooting based on error
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Troubleshooting: DNS resolution failed');
      console.log('- Check if the PostgreSQL service is running in Railway');
      console.log('- Verify the service name in the variable reference');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Troubleshooting: Connection refused');
      console.log('- PostgreSQL service might not be started');
      console.log('- Check Railway PostgreSQL service status');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Troubleshooting: Authentication failed');
      console.log('- Check if Railway variable reference is resolving correctly');
      console.log('- Verify PostgreSQL service credentials');
    } else if (error.message.includes('${{')) {
      console.log('\n🔧 Troubleshooting: Variable reference not resolved');
      console.log('- Railway is not resolving the variable reference');
      console.log('- Check variable reference setup in Railway dashboard');
    } else {
      console.log('\n🔧 General troubleshooting:');
      console.log('- Check Railway logs for more details');
      console.log('- Verify all environment variables are set');
      console.log('- Ensure PostgreSQL service is running');
    }
  }
  
  console.log('\n📝 Railway Setup Checklist:');
  console.log('- [ ] PostgreSQL service added to Railway project');
  console.log('- [ ] Variable reference set: DATABASE_URL = ${{ Postgres.DATABASE_URL }}');
  console.log('- [ ] Backend service has access to PostgreSQL service');
  console.log('- [ ] All environment variables configured');
  console.log('- [ ] NODE_ENV = production set');
}

// Run test if this file is executed directly
if (require.main === module) {
  testRailwayDeployment();
}

module.exports = testRailwayDeployment; 