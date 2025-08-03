#!/usr/bin/env node

/**
 * DataVine.ai Quick Test Suite
 * Tests core functionality without external dependencies
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:5001/api';
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

// Authentication Tests
const testAuthentication = async () => {
  log('\n🔐 AUTHENTICATION TESTS', 'info');
  
  await test('User Registration', async () => {
    const response = await makeRequest(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'test123'
      })
    });
    
    if (!response.data.success) throw new Error(`Registration failed: ${response.data.message}`);
    authToken = response.data.token;
  });

  await test('User Login', async () => {
    const response = await makeRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    if (!response.data.success) throw new Error(`Login failed: ${response.data.message}`);
    if (response.data.token) authToken = response.data.token;
  });

  await test('Duplicate Registration Prevention', async () => {
    const response = await makeRequest(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User 2',
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    if (response.data.success) throw new Error('Duplicate registration should fail');
  });
};

// Assessment Tests
const testAssessments = async () => {
  log('\n📊 ASSESSMENT TESTS', 'info');
  
  await test('Save Assessment Result', async () => {
    const response = await makeRequest(`${BASE_URL}/assessments/save`, {
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
    
    if (!response.data.success) throw new Error(`Assessment save failed: ${response.data.message}`);
  });

  await test('Get Assessment History', async () => {
    const response = await makeRequest(`${BASE_URL}/assessments/history`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (!response.data.success) throw new Error(`Get history failed: ${response.data.message}`);
  });
};

// AI Features Tests
const testAIFeatures = async () => {
  log('\n🤖 AI FEATURES TESTS', 'info');
  
  await test('Generate AI Recommendations', async () => {
    const response = await makeRequest(`${BASE_URL}/ai/generate-recommendations`, {
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
    
    if (!response.data.success) throw new Error(`AI recommendations failed: ${response.data.message}`);
  });
};

// Payment Tests
const testPayments = async () => {
  log('\n💳 PAYMENT TESTS', 'info');
  
  await test('Create Payment Intent', async () => {
    const response = await makeRequest(`${BASE_URL}/payments/create-payment-intent`, {
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
    
    if (!response.data.success) throw new Error(`Payment intent creation failed: ${response.data.message}`);
  });
};

// Security Tests
const testSecurity = async () => {
  log('\n🔒 SECURITY TESTS', 'info');
  
  await test('Unauthorized Access Prevention', async () => {
    const response = await makeRequest(`${BASE_URL}/users/profile`);
    if (response.status !== 401) throw new Error('Unauthorized access should return 401');
  });

  await test('Invalid Token Rejection', async () => {
    const response = await makeRequest(`${BASE_URL}/users/profile`, {
      headers: { 'Authorization': 'Bearer invalid_token' }
    });
    if (response.status !== 401) throw new Error('Invalid token should return 401');
  });
};

// Frontend Tests
const testFrontend = async () => {
  log('\n🌐 FRONTEND TESTS', 'info');
  
  await test('Frontend Accessibility', async () => {
    const response = await makeRequest(FRONTEND_URL);
    if (response.status !== 200) throw new Error('Frontend should be accessible');
  });
};

// Performance Tests
const testPerformance = async () => {
  log('\n⚡ PERFORMANCE TESTS', 'info');
  
  await test('API Response Time', async () => {
    const start = Date.now();
    await makeRequest(`${BASE_URL}/health`);
    const duration = Date.now() - start;
    
    if (duration > 1000) throw new Error(`API response too slow: ${duration}ms`);
    log(`✅ API response time: ${duration}ms`, 'success');
  });
};

// Main test runner
const runTests = async () => {
  log('🚀 Starting DataVine.ai Quick Test Suite', 'info');
  log('==================================================', 'info');
  
  try {
    await testAuthentication();
    await testAssessments();
    await testAIFeatures();
    await testPayments();
    await testSecurity();
    await testFrontend();
    await testPerformance();
    
    // Summary
    log('\n📊 TEST SUMMARY', 'info');
    log('==================================================', 'info');
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

// Run tests
runTests(); 