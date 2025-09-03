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
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: String,
  address: String,
  role: {
    type: String,
    required: true,
    enum: ['Manager', 'Cashier', 'Salesperson', 'Helper', 'Admin'],
  },
  salaryType: {
    type: String,
    required: true,
    enum: ['Fixed', 'Commission', 'Hybrid'],
  },
  baseSalary: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  commissionRate: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  documents: [{
    type: String,
    url: String,
    uploadedAt: Date,
  }],
  notes: String,
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Employee', schema);
