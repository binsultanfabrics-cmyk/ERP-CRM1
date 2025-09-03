const { modelsFiles } = require('@/models/utils');

const mongoose = require('mongoose');

const create = require('./create');
const read = require('./read');
const update = require('./update');
const remove = require('./remove');
const search = require('./search');
const filter = require('./filter');
const summary = require('./summary');
const listAll = require('./listAll');
const paginatedList = require('./paginatedList');

const createCRUDController = (modelName) => {
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  }

  // Check if database is connected and model is available
  if (!mongoose.connection.readyState || !mongoose.models[modelName]) {
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

  const Model = mongoose.model(modelName);
  let crudMethods = {
    create: (req, res) => create(Model, req, res),
    read: (req, res) => read(Model, req, res),
    update: (req, res) => update(Model, req, res),
    delete: (req, res) => remove(Model, req, res),
    list: (req, res) => paginatedList(Model, req, res),
    listAll: (req, res) => listAll(Model, req, res),
    search: (req, res) => search(Model, req, res),
    filter: (req, res) => filter(Model, req, res),
    summary: (req, res) => summary(Model, req, res),
  };
  return crudMethods;
};

module.exports = createCRUDController;
