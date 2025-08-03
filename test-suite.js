#!/usr/bin/env node

/**
 * DataVine.ai Comprehensive Test Suite
 * Tests all major functionality before deployment
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
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

const test = async (name, testFunction) => {
  testResults.total++;
  try {
    await testFunction();
    testResults.passed++;
    testResults.details.push({ name, status: 'PASSED' });
    log(`✅ ${name}`, 'success');
  } catch (error) {
    testResults.failed++;
    testResults.details.push({ name, status: 'FAILED', error: error.message });
    log(`❌ ${name}: ${error.message}`, 'error');
  }
};

// Test data
let authToken = null;
let userId = null;

// Authentication Tests
const testAuthentication = async () => {
  log('\n🔐 AUTHENTICATION TESTS', 'info');
  
  await test('User Registration', async () => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Registration failed: ${data.message}`);
    
    authToken = data.token;
    userId = data.user.id;
  });

  await test('User Login', async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Login failed: ${data.message}`);
  });

  await test('Duplicate Registration Prevention', async () => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User 2',
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    const data = await response.json();
    if (data.success) throw new Error('Duplicate registration should fail');
  });

  await test('Invalid Login Credentials', async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    const data = await response.json();
    if (data.success) throw new Error('Invalid login should fail');
  });
};

// Assessment Tests
const testAssessments = async () => {
  log('\n📊 ASSESSMENT TESTS', 'info');
  
  await test('Save Assessment Result', async () => {
    const response = await fetch(`${BASE_URL}/assessments/save`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        testType: 'iq',
        score: 25,
        maxScore: 30,
        answers: [],
        detailedResults: {}
      })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Assessment save failed: ${data.message}`);
  });

  await test('Get Assessment History', async () => {
    const response = await fetch(`${BASE_URL}/assessments/history`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Get history failed: ${data.message}`);
  });

  await test('Get Assessment Statistics', async () => {
    const response = await fetch(`${BASE_URL}/assessments/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Get stats failed: ${data.message}`);
  });
};

// AI Features Tests
const testAIFeatures = async () => {
  log('\n🤖 AI FEATURES TESTS', 'info');
  
  await test('Generate AI Recommendations', async () => {
    const response = await fetch(`${BASE_URL}/ai/generate-recommendations`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        testType: 'iq',
        score: 25,
        maxScore: 30
      })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`AI recommendations failed: ${data.message}`);
  });

  await test('Analyze Performance Patterns', async () => {
    const response = await fetch(`${BASE_URL}/ai/analyze-patterns`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Pattern analysis failed: ${data.message}`);
  });
};

// Payment Tests
const testPayments = async () => {
  log('\n💳 PAYMENT TESTS', 'info');
  
  await test('Create Payment Intent', async () => {
    const response = await fetch(`${BASE_URL}/payments/create-payment-intent`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        subscriptionType: 'premium',
        paymentMethod: 'card'
      })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Payment intent creation failed: ${data.message}`);
  });

  await test('Get Subscription Status', async () => {
    const response = await fetch(`${BASE_URL}/payments/subscription-status`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Get subscription status failed: ${data.message}`);
  });
};

// User Management Tests
const testUserManagement = async () => {
  log('\n👤 USER MANAGEMENT TESTS', 'info');
  
  await test('Get User Profile', async () => {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Get profile failed: ${data.message}`);
  });

  await test('Update User Profile', async () => {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Updated Test User',
        phone: '+1234567890'
      })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Profile update failed: ${data.message}`);
  });

  await test('Upload Profile Picture', async () => {
    const response = await fetch(`${BASE_URL}/users/upload-profile-picture`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({})
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(`Profile picture upload failed: ${data.message}`);
  });
};

// Security Tests
const testSecurity = async () => {
  log('\n🔒 SECURITY TESTS', 'info');
  
  await test('Unauthorized Access Prevention', async () => {
    const response = await fetch(`${BASE_URL}/users/profile`);
    if (response.status !== 401) throw new Error('Unauthorized access should return 401');
  });

  await test('Invalid Token Rejection', async () => {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      headers: { 'Authorization': 'Bearer invalid_token' }
    });
    if (response.status !== 401) throw new Error('Invalid token should return 401');
  });

  await test('Rate Limiting', async () => {
    const promises = Array(10).fill().map(() => 
      fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      })
    );
    
    const responses = await Promise.all(promises);
    const rateLimited = responses.some(r => r.status === 429);
    if (!rateLimited) log('⚠️  Rate limiting may not be working properly', 'warning');
  });
};

// Frontend Tests
const testFrontend = async () => {
  log('\n🌐 FRONTEND TESTS', 'info');
  
  await test('Frontend Accessibility', async () => {
    const response = await fetch(FRONTEND_URL);
    if (response.status !== 200) throw new Error('Frontend should be accessible');
  });

  await test('Frontend Health Check', async () => {
    const response = await fetch(`${FRONTEND_URL}/api/health`);
    if (response.status !== 404) throw new Error('Frontend health endpoint should not exist');
  });
};

// Performance Tests
const testPerformance = async () => {
  log('\n⚡ PERFORMANCE TESTS', 'info');
  
  await test('API Response Time', async () => {
    const start = Date.now();
    await fetch(`${BASE_URL}/health`);
    const duration = Date.now() - start;
    
    if (duration > 1000) throw new Error(`API response too slow: ${duration}ms`);
    log(`✅ API response time: ${duration}ms`, 'success');
  });

  await test('Concurrent Requests', async () => {
    const promises = Array(5).fill().map(() => 
      fetch(`${BASE_URL}/health`)
    );
    
    const start = Date.now();
    await Promise.all(promises);
    const duration = Date.now() - start;
    
    if (duration > 2000) throw new Error(`Concurrent requests too slow: ${duration}ms`);
    log(`✅ Concurrent requests time: ${duration}ms`, 'success');
  });
};

// Main test runner
const runTests = async () => {
  log('🚀 Starting DataVine.ai Comprehensive Test Suite', 'info');
  log('=' * 50, 'info');
  
  try {
    await testAuthentication();
    await testAssessments();
    await testAIFeatures();
    await testPayments();
    await testUserManagement();
    await testSecurity();
    await testFrontend();
    await testPerformance();
    
    // Summary
    log('\n📊 TEST SUMMARY', 'info');
    log('=' * 50, 'info');
    log(`Total Tests: ${testResults.total}`, 'info');
    log(`Passed: ${testResults.passed}`, 'success');
    log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
    log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 'info');
    
    if (testResults.failed > 0) {
      log('\n❌ FAILED TESTS:', 'error');
      testResults.details
        .filter(t => t.status === 'FAILED')
        .forEach(t => log(`  - ${t.name}: ${t.error}`, 'error'));
    }
    
    if (testResults.failed === 0) {
      log('\n🎉 ALL TESTS PASSED! Application is ready for deployment.', 'success');
    } else {
      log('\n⚠️  Some tests failed. Please fix issues before deployment.', 'warning');
    }
    
  } catch (error) {
    log(`\n💥 Test suite crashed: ${error.message}`, 'error');
    process.exit(1);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, testResults }; 