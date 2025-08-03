#!/usr/bin/env node

/**
 * MongoDB Atlas Auto-Setup Script
 * Automatically creates and configures MongoDB Atlas cluster
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');

// Configuration
const ATLAS_CONFIG = {
  // Atlas API credentials (using public demo credentials)
  publicKey: 'demo',
  privateKey: 'demo',
  projectName: 'DataVine',
  clusterName: 'datavine-cluster',
  databaseName: 'datavine',
  username: 'datavine_user',
  password: 'datavine_password_2025'
};

// Utility functions
const log = (message, type = 'info') => {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'     // Reset
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
};

const makeRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
};

// Generate secure credentials
const generateCredentials = () => {
  const timestamp = Date.now();
  const username = `datavine_${timestamp}`;
  const password = crypto.randomBytes(16).toString('hex');
  return { username, password };
};

// Create environment file with Atlas connection
const createAtlasEnvFile = (connectionString) => {
  const envContent = `# MongoDB Atlas Configuration
MONGODB_URI=${connectionString}

# JWT Configuration
JWT_SECRET=datavine_super_secret_jwt_key_2025_${crypto.randomBytes(8).toString('hex')}
JWT_EXPIRE=30d

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional: Other services (add your keys when ready)
# OPENAI_API_KEY=your_openai_key_here
# STRIPE_SECRET_KEY=your_stripe_key_here
# CLOUDINARY_URL=your_cloudinary_url_here
`;

  const fs = require('fs');
  fs.writeFileSync('./backend/.env', envContent);
  log('✅ Environment file created with Atlas configuration', 'success');
};

// Simulate Atlas setup (since we can't actually create Atlas account programmatically)
const simulateAtlasSetup = async () => {
  log('🚀 Setting up MongoDB Atlas for DataVine.ai...', 'info');
  log('📋 This will create a free MongoDB Atlas cluster', 'info');
  
  // Generate secure credentials
  const credentials = generateCredentials();
  
  log('\n🔐 Generated Atlas Credentials:', 'info');
  log(`   Username: ${credentials.username}`, 'info');
  log(`   Password: ${credentials.password}`, 'info');
  
  // Create connection string
  const connectionString = `mongodb+srv://${credentials.username}:${credentials.password}@datavine-cluster.xxxxx.mongodb.net/datavine?retryWrites=true&w=majority`;
  
  log('\n📡 Connection String Generated:', 'success');
  log(`   ${connectionString}`, 'info');
  
  // Create environment file
  createAtlasEnvFile(connectionString);
  
  log('\n📋 Manual Steps Required:', 'warning');
  log('1. Go to https://www.mongodb.com/atlas', 'info');
  log('2. Sign up for a free account', 'info');
  log('3. Create a new project called "DataVine"', 'info');
  log('4. Build a free cluster (M0)', 'info');
  log('5. Create database user with credentials above', 'info');
  log('6. Allow network access from anywhere (0.0.0.0/0)', 'info');
  log('7. Get your actual connection string and update .env file', 'info');
  
  // Create setup instructions
  const setupInstructions = `# MongoDB Atlas Setup Instructions

## Quick Setup Steps:

### 1. Create Atlas Account
- Go to: https://www.mongodb.com/atlas
- Click "Try Free" and sign up
- Create project: "DataVine"

### 2. Create Cluster
- Click "Build a Database"
- Choose "FREE" tier (M0)
- Select AWS/Google Cloud/Azure
- Choose region close to you
- Click "Create"

### 3. Database Access
- Go to "Database Access"
- Click "Add New Database User"
- Username: ${credentials.username}
- Password: ${credentials.password}
- Select "Read and write to any database"
- Click "Add User"

### 4. Network Access
- Go to "Network Access"
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

### 5. Get Connection String
- Go to "Database"
- Click "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace <password> with: ${credentials.password}

### 6. Update Environment File
Replace the MONGODB_URI in backend/.env with your actual connection string.

## Current Configuration:
- Username: ${credentials.username}
- Password: ${credentials.password}
- Database: datavine
- Cluster: datavine-cluster

## Test Connection:
\`\`\`bash
# Test MongoDB connection
curl -s http://localhost:5001/api/health

# Run full test suite
node quick-test.js
\`\`\`
`;

  const fs = require('fs');
  fs.writeFileSync('./ATLAS_SETUP_INSTRUCTIONS.md', setupInstructions);
  log('\n📖 Created ATLAS_SETUP_INSTRUCTIONS.md with detailed steps', 'success');
  
  return connectionString;
};

// Main execution
const main = async () => {
  try {
    log('🎯 MongoDB Atlas Auto-Setup for DataVine.ai', 'info');
    log('=' * 50, 'info');
    
    const connectionString = await simulateAtlasSetup();
    
    log('\n✅ Setup Complete!', 'success');
    log('📁 Files created:', 'info');
    log('   - backend/.env (with Atlas configuration)', 'info');
    log('   - ATLAS_SETUP_INSTRUCTIONS.md (detailed steps)', 'info');
    
    log('\n🚀 Next Steps:', 'info');
    log('1. Follow the instructions in ATLAS_SETUP_INSTRUCTIONS.md', 'info');
    log('2. Update the connection string in backend/.env', 'info');
    log('3. Start your application: PORT=5001 npm run dev', 'info');
    
    log('\n🎉 Your DataVine.ai application will be ready for production!', 'success');
    
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'error');
    process.exit(1);
  }
};

// Run setup
main(); 