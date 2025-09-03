const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const summary = require('./summary');
const create = require('./create');
const update = require('./update');
const remove = require('./remove');

function modelController() {
  const Model = mongoose.model('Product');
  const methods = createCRUDController('Product');

  methods.create = (req, res) => create(Model, req, res);
  methods.update = (req, res) => update(Model, req, res);
  methods.remove = (req, res) => remove(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  
  return methods;
}

module.exports = modelController();
