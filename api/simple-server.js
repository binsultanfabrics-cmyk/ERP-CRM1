const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Bin Sultan ERP + POS API is running',
    timestamp: new Date().toISOString()
  });
});

// Basic API endpoints for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
