require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config();

// Try to connect to MongoDB, but don't fail if it's not available
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

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Load models if MongoDB is available
if (process.env.DATABASE) {
  try {
    const modelsFiles = globSync('./src/models/**/*.js');
    
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
const app = require('./app');

// Start reminder jobs if database is connected (only in non-serverless environments)
if (process.env.DATABASE && !process.env.VERCEL) {
  const { startReminderJobs } = require('./jobs/reminderJob');
  startReminderJobs();
  
  // Initialize ERP features on startup
  const { initializeERPFeatures } = require('./setup/initializeERPFeatures');
  setTimeout(async () => {
    try {
      await initializeERPFeatures();
    } catch (error) {
      console.error('Failed to initialize ERP features:', error);
    }
  }, 5000); // Wait 5 seconds for database to be ready
}

// For Vercel deployment: always export the app for serverless function
// Vercel handles the request lifecycle in its serverless environment
// This allows Vercel to handle HTTP requests and route them through /api/* paths
// as configured in vercel.json
module.exports = app;

// For local development: also start the server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  // Development mode - start the server
  app.set('port', process.env.PORT || 8888);
  const server = app.listen(app.get('port'), () => {
    console.log(`Express running → On PORT : ${server.address().port}`);
  });
}