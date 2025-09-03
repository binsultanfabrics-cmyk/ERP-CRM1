const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const summary = require('./summary');

function modelController() {
  // Check if database is connected and model is available
  if (!mongoose.connection.readyState || !mongoose.models.Client) {
    // Return dummy methods that return appropriate responses when DB is not connected
    return {
      create: (req, res) => res.status(503).json({ error: 'Database not connected' }),
      read: (req, res) => res.status(503).json({ error: 'Database not connected' }),
      update: (req, res) => res.status(503).json({ error: 'Database not connected' }),
      delete: (req, res) => res.status(503).json({ error: 'Database not connected' }),
      list: (req, res) => res.status(503).json({ error: 'Database not connected' }),
      listAll: (req, res) => res.status(503).json({ error: 'Database not connected' }),
      search: (req, res) => res.status(503).json({ error: 'Database not connected' }),
      filter: (req, res) => res.status(503).json({ error: 'Database not connected' }),
      summary: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    };
  }

  const Model = mongoose.model('Client');
  const methods = createCRUDController('Client');

  methods.summary = (req, res) => summary(Model, req, res);
  return methods;
}

module.exports = modelController();
