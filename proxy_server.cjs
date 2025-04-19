// This proxy server routes requests between the frontend and the Django backend
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const { spawn } = require('child_process');
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const DJANGO_URL = 'http://localhost:8000';
const VITE_DEV_SERVER = 'http://localhost:5000';

// Start Django server
console.log('Starting Django server...');
const djangoProcess = spawn('python', ['run_django.py'], {
  detached: true,
  stdio: 'inherit'
});

// Wait for Django server to start
setTimeout(() => {
  console.log('Django server should be running now');

  // Proxy API requests to Django
  app.use('/api', createProxyMiddleware({
    target: DJANGO_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api' // keep '/api' in the path
    },
    onProxyReq: (proxyReq, req, res) => {
      // Log proxied requests
      console.log(`Proxying ${req.method} request to: ${DJANGO_URL}${proxyReq.path}`);
    }
  }));

  // Proxy all other requests to the Vite dev server
  app.use('/', createProxyMiddleware({
    target: VITE_DEV_SERVER,
    changeOrigin: true,
    ws: true, // support WebSocket
    onProxyReq: (proxyReq, req, res) => {
      // Log proxied requests
      console.log(`Proxying ${req.method} request to Vite: ${req.url}`);
    }
  }));

  // Start the proxy server
  app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
    console.log(`- Frontend (Vite): ${VITE_DEV_SERVER}`);
    console.log(`- Backend (Django): ${DJANGO_URL}`);
    console.log(`- API requests will be proxied to Django`);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down proxy server and Django...');
    if (djangoProcess && !djangoProcess.killed) {
      process.kill(-djangoProcess.pid);
    }
    process.exit(0);
  });

}, 5000); // Give Django 5 seconds to start up