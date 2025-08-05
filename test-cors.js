#!/usr/bin/env node

/**
 * CORS Test Script
 * Tests if the backend is sending proper CORS headers
 */

const https = require('https');

const testUrl = 'https://datavine-production.up.railway.app/api/health';

console.log('Testing CORS headers for:', testUrl);
console.log('=====================================');

// Test 1: Simple GET request
console.log('\n1️⃣ Testing simple GET request...');
const req1 = https.get(testUrl, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('CORS Headers:');
  console.log('  access-control-allow-origin:', res.headers['access-control-allow-origin']);
  console.log('  access-control-allow-credentials:', res.headers['access-control-allow-credentials']);
  console.log('  access-control-allow-methods:', res.headers['access-control-allow-methods']);
  console.log('  access-control-allow-headers:', res.headers['access-control-allow-headers']);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req1.on('error', (error) => {
  console.error('Error:', error.message);
});

// Test 2: OPTIONS request (preflight)
console.log('\n2️⃣ Testing OPTIONS request (preflight)...');
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

const req2 = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('CORS Headers:');
  console.log('  access-control-allow-origin:', res.headers['access-control-allow-origin']);
  console.log('  access-control-allow-credentials:', res.headers['access-control-allow-credentials']);
  console.log('  access-control-allow-methods:', res.headers['access-control-allow-methods']);
  console.log('  access-control-allow-headers:', res.headers['access-control-allow-headers']);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req2.on('error', (error) => {
  console.error('Error:', error.message);
});

req2.end();

// Test 3: POST request with Origin header
console.log('\n3️⃣ Testing POST request with Origin header...');
const postData = JSON.stringify({
  name: 'CORS Test User',
  email: 'cors-test@example.com',
  password: 'TestPass123'
});

const options2 = {
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

const req3 = https.request(options2, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('CORS Headers:');
  console.log('  access-control-allow-origin:', res.headers['access-control-allow-origin']);
  console.log('  access-control-allow-credentials:', res.headers['access-control-allow-credentials']);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req3.on('error', (error) => {
  console.error('Error:', error.message);
});

req3.write(postData);
req3.end(); 