#!/usr/bin/env node

/**
 * Test Production Signup Functionality
 * Tests the exact URL and request that the frontend would make
 */

const https = require('https');

const PRODUCTION_URL = 'https://datavine-production.up.railway.app';
const FRONTEND_URL = 'https://datavine.ai';

console.log('🧪 Testing Production Signup Functionality...\n');

// Test 1: Check if the backend is accessible from production frontend
async function testProductionSignup() {
  console.log('1️⃣ Testing Production Signup...');
  
  const testUser = {
    name: 'Production Test User',
    email: `prod-test-${Date.now()}@production.test`,
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
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'https://datavine.ai',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };
    
    const req = https.request(options, (res) => {
      console.log('Status Code:', res.statusCode);
      console.log('Headers:', {
        'access-control-allow-origin': res.headers['access-control-allow-origin'],
        'access-control-allow-credentials': res.headers['access-control-allow-credentials'],
        'content-type': res.headers['content-type']
      });
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('✅ Production signup successful');
            console.log('Response:', response);
            resolve({ success: true, token: response.token });
          } else {
            console.log('❌ Production signup failed:', response.message);
            resolve({ success: false, error: response.message });
          }
        } catch (error) {
          console.log('❌ Production signup failed - Invalid JSON');
          console.log('Raw response:', data);
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Production signup failed - Network error:', error.message);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Production signup failed - Timeout');
      resolve({ success: false, error: 'Timeout' });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 2: Check CORS preflight
async function testCorsPreflight() {
  console.log('\n2️⃣ Testing CORS Preflight...');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'datavine-production.up.railway.app',
      port: 443,
      path: '/api/auth/register',
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://datavine.ai',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };
    
    const req = https.request(options, (res) => {
      console.log('CORS Status Code:', res.statusCode);
      console.log('CORS Headers:', {
        'access-control-allow-origin': res.headers['access-control-allow-origin'],
        'access-control-allow-methods': res.headers['access-control-allow-methods'],
        'access-control-allow-headers': res.headers['access-control-allow-headers']
      });
      
      if (res.statusCode === 204 || res.statusCode === 200) {
        console.log('✅ CORS preflight successful');
        resolve(true);
      } else {
        console.log('❌ CORS preflight failed');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ CORS preflight failed - Network error:', error.message);
      resolve(false);
    });
    
    req.end();
  });
}

// Run tests
async function runTests() {
  const signupResult = await testProductionSignup();
  const corsResult = await testCorsPreflight();
  
  console.log('\n📊 Production Test Results:');
  console.log('============================');
  console.log(`Production Signup: ${signupResult.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`CORS Preflight: ${corsResult ? '✅ PASS' : '❌ FAIL'}`);
  
  if (signupResult.success && corsResult) {
    console.log('\n🎉 All production tests passed! Signup should work correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. This may explain the network error.');
    if (!corsResult) {
      console.log('💡 CORS issue detected - this could cause "Network error" in browser');
    }
    if (!signupResult.success) {
      console.log('💡 Backend issue detected - check server logs');
    }
  }
}

runTests().catch(error => {
  console.error('❌ Test suite failed with error:', error);
}); 