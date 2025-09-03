const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const summary = require('./summary');
const create = require('./create');
const update = require('./update');
const remove = require('./remove');

function modelController() {
  // Check if database is connected and model is available
  if (!mongoose.connection.readyState || !mongoose.models.Product) {
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
      remove: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    };
  }

  const Model = mongoose.model('Product');
  const methods = createCRUDController('Product');

  methods.create = (req, res) => create(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.remove = (req, res) => remove(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  
  return methods;
}

module.exports = modelController();
