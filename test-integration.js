#!/usr/bin/env node

/**
 * DataVine.ai Integration Test Suite
 * Tests all critical functionality before production deployment
 */

const https = require('https');
const http = require('http');

const PRODUCTION_URL = 'https://datavine-production.up.railway.app';
const FRONTEND_URL = 'https://datavine.ai';

console.log('🧪 Starting DataVine.ai Integration Tests...\n');

// Test 1: Backend Health Check
async function testBackendHealth() {
  console.log('1️⃣ Testing Backend Health...');
  
  return new Promise((resolve) => {
    const req = https.get(`${PRODUCTION_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === 'OK') {
            console.log('✅ Backend is healthy and running');
            resolve(true);
          } else {
            console.log('❌ Backend health check failed');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Backend health check failed - Invalid JSON');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Backend health check failed - Network error');
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Backend health check failed - Timeout');
      resolve(false);
    });
  });
}

// Test 2: User Registration
async function testUserRegistration() {
  console.log('2️⃣ Testing User Registration...');
  
  const testUser = {
    name: 'Integration Test User',
    email: `test-${Date.now()}@integration.test`,
    password: 'TestPass123'
  };
  
  return new Promise((resolve) => {
    const postData = JSON.stringify(testUser);
    
    const options = {
      hostname: 'datavine-production.up.railway.app',
      port: 443,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('✅ User registration successful');
            resolve({ success: true, token: response.token });
          } else {
            console.log('❌ User registration failed:', response.message);
            resolve({ success: false });
          }
        } catch (error) {
          console.log('❌ User registration failed - Invalid JSON');
          resolve({ success: false });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ User registration failed - Network error');
      resolve({ success: false });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 3: User Login
async function testUserLogin() {
  console.log('3️⃣ Testing User Login...');
  
  const testUser = {
    email: 'test@example.com',
    password: 'TestPass123'
  };
  
  return new Promise((resolve) => {
    const postData = JSON.stringify(testUser);
    
    const options = {
      hostname: 'datavine-production.up.railway.app',
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('✅ User login successful');
            resolve({ success: true, token: response.token });
          } else {
            console.log('❌ User login failed:', response.message);
            resolve({ success: false });
          }
        } catch (error) {
          console.log('❌ User login failed - Invalid JSON');
          resolve({ success: false });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ User login failed - Network error');
      resolve({ success: false });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 4: Google OAuth Simulation
async function testGoogleOAuth() {
  console.log('4️⃣ Testing Google OAuth Simulation...');
  
  const testData = {
    email: 'google.test@example.com',
    name: 'Google Test User',
    googleId: 'google_test_123'
  };
  
  return new Promise((resolve) => {
    const postData = JSON.stringify(testData);
    
    const options = {
      hostname: 'datavine-production.up.railway.app',
      port: 443,
      path: '/api/auth/google',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('✅ Google OAuth simulation successful');
            resolve({ success: true, token: response.token });
          } else {
            console.log('❌ Google OAuth simulation failed:', response.message);
            resolve({ success: false });
          }
        } catch (error) {
          console.log('❌ Google OAuth simulation failed - Invalid JSON');
          resolve({ success: false });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Google OAuth simulation failed - Network error');
      resolve({ success: false });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 5: Frontend Accessibility
async function testFrontendAccessibility() {
  console.log('5️⃣ Testing Frontend Accessibility...');
  
  return new Promise((resolve) => {
    const req = https.get(FRONTEND_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend is accessible');
        resolve(true);
      } else {
        console.log('❌ Frontend accessibility failed - Status:', res.statusCode);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ Frontend accessibility failed - Network error');
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Frontend accessibility failed - Timeout');
      resolve(false);
    });
  });
}

// Run all tests
async function runAllTests() {
  const results = {
    backendHealth: false,
    userRegistration: false,
    userLogin: false,
    googleOAuth: false,
    frontendAccessibility: false
  };
  
  // Test 1: Backend Health
  results.backendHealth = await testBackendHealth();
  
  // Test 2: User Registration
  const registrationResult = await testUserRegistration();
  results.userRegistration = registrationResult.success;
  
  // Test 3: User Login
  const loginResult = await testUserLogin();
  results.userLogin = loginResult.success;
  
  // Test 4: Google OAuth
  const googleResult = await testGoogleOAuth();
  results.googleOAuth = googleResult.success;
  
  // Test 5: Frontend Accessibility
  results.frontendAccessibility = await testFrontendAccessibility();
  
  // Summary
  console.log('\n📊 Integration Test Results:');
  console.log('============================');
  console.log(`Backend Health: ${results.backendHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`User Registration: ${results.userRegistration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`User Login: ${results.userLogin ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Google OAuth: ${results.googleOAuth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Accessibility: ${results.frontendAccessibility ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 All integration tests passed! Production is ready.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some integration tests failed. Please fix issues before deployment.');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test suite failed with error:', error);
  process.exit(1);
}); 