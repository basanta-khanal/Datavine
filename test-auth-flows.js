#!/usr/bin/env node

/**
 * Test All Authentication Flows
 * Tests signup, signin, Google login, and forgot password
 */

const https = require('https');

const PRODUCTION_URL = 'https://datavine-production.up.railway.app';

console.log('🧪 Testing All Authentication Flows...\n');

// Test 1: User Registration
async function testUserRegistration() {
  console.log('1️⃣ Testing User Registration...');
  
  const testUser = {
    name: 'Auth Test User',
    email: `auth-test-${Date.now()}@test.com`,
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
        'Origin': 'https://datavine.ai'
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
            resolve({ success: true, token: response.token, user: testUser });
          } else {
            console.log('❌ User registration failed:', response.message);
            resolve({ success: false, error: response.message });
          }
        } catch (error) {
          console.log('❌ User registration failed - Invalid JSON');
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ User registration failed - Network error:', error.message);
      resolve({ success: false, error: error.message });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 2: User Login
async function testUserLogin(email, password) {
  console.log('2️⃣ Testing User Login...');
  
  const loginData = { email, password };
  
  return new Promise((resolve) => {
    const postData = JSON.stringify(loginData);
    
    const options = {
      hostname: 'datavine-production.up.railway.app',
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'https://datavine.ai'
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
            resolve({ success: false, error: response.message });
          }
        } catch (error) {
          console.log('❌ User login failed - Invalid JSON');
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ User login failed - Network error:', error.message);
      resolve({ success: false, error: error.message });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 3: Google OAuth Simulation
async function testGoogleOAuth() {
  console.log('3️⃣ Testing Google OAuth Simulation...');
  
  const googleData = {
    email: 'google.auth.test@gmail.com',
    name: 'Google Auth Test User',
    googleId: 'google_auth_test_' + Date.now()
  };
  
  return new Promise((resolve) => {
    const postData = JSON.stringify(googleData);
    
    const options = {
      hostname: 'datavine-production.up.railway.app',
      port: 443,
      path: '/api/auth/google',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'https://datavine.ai'
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
            resolve({ success: false, error: response.message });
          }
        } catch (error) {
          console.log('❌ Google OAuth simulation failed - Invalid JSON');
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Google OAuth simulation failed - Network error:', error.message);
      resolve({ success: false, error: error.message });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 4: Forgot Password
async function testForgotPassword(email) {
  console.log('4️⃣ Testing Forgot Password...');
  
  const forgotData = { email };
  
  return new Promise((resolve) => {
    const postData = JSON.stringify(forgotData);
    
    const options = {
      hostname: 'datavine-production.up.railway.app',
      port: 443,
      path: '/api/auth/forgot-password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'https://datavine.ai'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('✅ Forgot password successful');
            console.log('📧 Reset link info:', response.message);
            if (response.resetLink) {
              console.log('🔗 Reset link:', response.resetLink);
            }
            resolve({ success: true, resetLink: response.resetLink });
          } else {
            console.log('❌ Forgot password failed:', response.message);
            resolve({ success: false, error: response.message });
          }
        } catch (error) {
          console.log('❌ Forgot password failed - Invalid JSON');
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Forgot password failed - Network error:', error.message);
      resolve({ success: false, error: error.message });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test 5: Reset Password (if we have a reset link)
async function testResetPassword(token, newPassword) {
  console.log('5️⃣ Testing Reset Password...');
  
  const resetData = { token, newPassword };
  
  return new Promise((resolve) => {
    const postData = JSON.stringify(resetData);
    
    const options = {
      hostname: 'datavine-production.up.railway.app',
      port: 443,
      path: '/api/auth/reset-password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'https://datavine.ai'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('✅ Password reset successful');
            resolve({ success: true });
          } else {
            console.log('❌ Password reset failed:', response.message);
            resolve({ success: false, error: response.message });
          }
        } catch (error) {
          console.log('❌ Password reset failed - Invalid JSON');
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Password reset failed - Network error:', error.message);
      resolve({ success: false, error: error.message });
    });
    
    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runAllTests() {
  const results = {
    registration: false,
    login: false,
    googleOAuth: false,
    forgotPassword: false,
    resetPassword: false
  };
  
  // Test 1: Registration
  const registrationResult = await testUserRegistration();
  results.registration = registrationResult.success;
  
  if (registrationResult.success) {
    // Test 2: Login with registered user
    const loginResult = await testUserLogin(registrationResult.user.email, registrationResult.user.password);
    results.login = loginResult.success;
  }
  
  // Test 3: Google OAuth
  const googleResult = await testGoogleOAuth();
  results.googleOAuth = googleResult.success;
  
  // Test 4: Forgot Password
  const forgotResult = await testForgotPassword('test@example.com');
  results.forgotPassword = forgotResult.success;
  
  // Test 5: Reset Password (if we have a token)
  if (forgotResult.resetLink) {
    const token = forgotResult.resetLink.split('token=')[1];
    if (token) {
      const resetResult = await testResetPassword(token, 'NewTestPass123');
      results.resetPassword = resetResult.success;
    }
  }
  
  // Summary
  console.log('\n📊 Authentication Flow Test Results:');
  console.log('=====================================');
  console.log(`User Registration: ${results.registration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`User Login: ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Google OAuth: ${results.googleOAuth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Forgot Password: ${results.forgotPassword ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Reset Password: ${results.resetPassword ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 All authentication flows are working correctly!');
  } else {
    console.log('\n⚠️  Some authentication flows failed. Please check the issues above.');
  }
  
  return results;
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test suite failed with error:', error);
  process.exit(1);
}); 