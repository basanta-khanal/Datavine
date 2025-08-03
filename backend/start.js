#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting DataVine.ai Backend...');

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' }
});

// Wait a bit for server to start
setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: process.env.PORT || 5001,
    path: '/',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Server is healthy and ready!');
      process.exit(0);
    } else {
      console.log(`❌ Health check failed with status: ${res.statusCode}`);
      process.exit(1);
    }
  });

  req.on('error', (err) => {
    console.log('❌ Health check failed:', err.message);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('❌ Health check timed out');
    req.destroy();
    process.exit(1);
  });

  req.end();
}, 3000);

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 