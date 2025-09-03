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
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  companyName: String,
  contactPerson: String,
  phone: {
    type: String,
    required: true,
  },
  email: String,
  address: String,
  city: String,
  country: String,
  taxNumber: String,
  creditLimit: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  currentBalance: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  paymentTerms: {
    type: Number,
    default: 30, // days
  },
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

module.exports = mongoose.model('Supplier', schema);
