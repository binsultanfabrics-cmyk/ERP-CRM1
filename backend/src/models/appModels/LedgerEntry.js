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
  partyType: {
    type: String,
    required: true,
    enum: ['Customer', 'Supplier', 'Employee'],
  },
  partyId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    refPath: 'partyModel',
  },
  partyModel: {
    type: String,
    required: true,
    enum: ['Client', 'Supplier', 'Employee'],
  },
  entryType: {
    type: String,
    required: true,
    enum: ['Sale', 'Payment', 'Purchase', 'Return', 'Advance', 'Salary', 'Commission', 'Adjustment'],
  },
  debit: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  credit: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  balance: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  refId: {
    type: mongoose.Schema.ObjectId,
    refPath: 'refModel',
  },
  refModel: {
    type: String,
    enum: ['PosSale', 'Payment', 'Purchase', 'PosReturn', 'Payroll'],
  },
  description: String,
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

// Index for efficient queries
schema.index({ partyType: 1, partyId: 1, date: -1 });
schema.index({ entryType: 1, date: -1 });
schema.index({ refId: 1, refModel: 1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('LedgerEntry', schema);
