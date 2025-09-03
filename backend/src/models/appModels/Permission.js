const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
    enum: ['POS', 'Inventory', 'Ledger', 'Reports', 'Payroll', 'Purchase', 'Settings', 'Admin'],
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'read', 'update', 'delete', 'approve', 'view', 'run', 'export'],
  },
  resource: {
    type: String,
    required: true,
  },
  isSystemPermission: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
schema.index({ name: 1 });
schema.index({ module: 1, action: 1, resource: 1 });
schema.index({ isSystemPermission: 1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Permission', schema);
