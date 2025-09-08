const express = require('express');

const cors = require('cors');
const compression = require('compression');

const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const adminAuth = require('./controllers/coreControllers/adminAuth');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');
const posRoutes = require('./routes/appRoutes/posRoutes');

const fileUpload = require('express-fileupload');
// create our Express app
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

// // default options
// app.use(fileUpload());

// Here our API Routes

// Test route to verify serverless function is working
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasDatabase: !!process.env.DATABASE
  });
});

// Debug route to see all incoming requests
app.all('/api/*', (req, res, next) => {
  console.log('API Request received:', {
    method: req.method,
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl,
    headers: req.headers
  });
  next();
});

app.use('/api', coreAuthRouter);
app.use('/api', coreApiRouter);
app.use('/api', erpApiRouter);
app.use('/api/pos', posRoutes);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
