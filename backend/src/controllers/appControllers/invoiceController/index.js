const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

// Check if database is connected and model is available
let methods;
if (!require('mongoose').connection.readyState || !require('mongoose').models.Invoice) {
  // Return dummy methods that return appropriate responses when DB is not connected
  methods = {
    create: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    read: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    update: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    delete: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    list: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    listAll: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    search: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    filter: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    summary: (req, res) => res.status(503).json({ error: 'Database not connected' }),
    mail: (req, res) => res.status(503).json({ error: 'Database not connected' }),
  };
} else {
  methods = createCRUDController('Invoice');
}

const sendMail = require('./sendMail');
const create = require('./create');
const summary = require('./summary');
const update = require('./update');
const remove = require('./remove');
const paginatedList = require('./paginatedList');
const read = require('./read');

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;
methods.list = paginatedList;
methods.read = read;

module.exports = methods;
