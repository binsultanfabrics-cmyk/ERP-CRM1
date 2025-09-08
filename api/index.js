// Vercel serverless function entry point
// This file handles all API requests and routes them to the Express app

require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Make sure we are running node 20+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

// import environmental variables
require('dotenv').config();

// Try to connect to MongoDB
if (process.env.DATABASE) {
  mongoose.connect(process.env.DATABASE);
  
  mongoose.connection.on('error', (error) => {
    console.log(
      `1. 🔥 Common Error caused issue → : check your .env file first and add your mongodb url`
    );
    console.error(`2. 🚫 Error → : ${error.message}`);
  });
  
  mongoose.connection.once('open', () => {
    console.log('✅ MongoDB connected successfully');
  });
} else {
  console.log('⚠️  No DATABASE environment variable found. Server will start without database connection.');
}

// Load models if MongoDB is available
if (process.env.DATABASE) {
  try {
    const modelsFiles = globSync('./backend/src/models/**/*.js');
    
    for (const filePath of modelsFiles) {
      require(path.resolve(filePath));
    }
    console.log('✅ Models loaded successfully');
  } catch (error) {
    console.log('⚠️  Some models failed to load:', error.message);
  }
} else {
  console.log('⚠️  Skipping model loading - no database connection');
}

// Create our Express app
const app = require('../backend/src/app');

// Export the handler for Vercel
module.exports = app;
