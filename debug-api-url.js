#!/usr/bin/env node

/**
 * Debug script to test API URL detection
 */

// Simulate browser environment
global.window = {
  location: {
    hostname: 'datavine.ai'
  }
};

// Simulate the API URL detection logic
const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL + '/api';
  }
  
  // In development (localhost), use local backend
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('Using localhost backend');
    return 'http://localhost:5001/api';
  }
  
  // In production, use Railway backend
  console.log('Using production Railway backend');
  return 'https://datavine-production.up.railway.app/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('Final API_BASE_URL:', API_BASE_URL);

// Test the URL
const testUrl = `${API_BASE_URL}/health`;
console.log('Test URL:', testUrl);

// Test the connection
const https = require('https');

const req = https.get(testUrl, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.setTimeout(10000, () => {
  console.error('Timeout');
}); 