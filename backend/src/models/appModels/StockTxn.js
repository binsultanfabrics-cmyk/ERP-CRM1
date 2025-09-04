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
  type: {
    type: String,
    required: true,
    enum: ['IN', 'OUT', 'ADJUST', 'DISPOSAL', 'RETURN', 'TRANSFER'],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  roll: {
    type: mongoose.Schema.ObjectId,
    ref: 'InventoryRoll',
    required: true,
  },
  qty: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ['m', 'yd'],
  },
  refType: {
    type: String,
    enum: ['Purchase', 'Sale', 'Return', 'Adjustment', 'Disposal', 'Transfer'],
  },
  refId: {
    type: mongoose.Schema.ObjectId,
    refPath: 'refModel',
  },
  refModel: {
    type: String,
    enum: ['PosSale', 'PosReturn', 'Purchase', 'StockAdjustment', 'Disposal', 'PurchaseOrder', 'StockTransfer'],
  },
  fromLocation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
  },
  toLocation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
  },
  previousQty: {
    type: mongoose.Schema.Types.Decimal128,
  },
  newQty: {
    type: mongoose.Schema.Types.Decimal128,
  },
  unitCost: {
    type: mongoose.Schema.Types.Decimal128,
  },
  totalValue: {
    type: mongoose.Schema.Types.Decimal128,
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

// Index for efficient queries
schema.index({ product: 1, roll: 1, type: 1, created: -1 });
schema.index({ refType: 1, refId: 1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('StockTxn', schema);
