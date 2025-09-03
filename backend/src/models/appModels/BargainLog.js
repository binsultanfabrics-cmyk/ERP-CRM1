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
  sale: {
    type: mongoose.Schema.ObjectId,
    ref: 'PosSale',
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  staff: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true,
  },
  originalPrice: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  finalPrice: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  discountPct: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  discountAmount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  approvalLevel: {
    type: String,
    enum: ['Cashier', 'Manager', 'Owner'],
    required: true,
  },
  reason: String,
  customerName: String,
  customerPhone: String,
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
schema.index({ sale: 1 });
schema.index({ staff: 1, created: -1 });
schema.index({ approvedBy: 1, created: -1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('BargainLog', schema);
