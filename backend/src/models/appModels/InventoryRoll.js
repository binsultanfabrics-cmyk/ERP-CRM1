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
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  barcode: String,
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  batchNumber: String,
  initLength: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  remainingLength: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ['m', 'yd'],
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Low Stock', 'Out of Stock', 'Damaged', 'Disposed', 'Reserved'],
    default: 'Available',
  },
  isTail: {
    type: Boolean,
    default: false,
  },
  minCutLength: {
    type: mongoose.Schema.Types.Decimal128,
    default: 1.0, // Minimum cut length in meters/yards
  },
  costPerUnit: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  receivedAt: {
    type: Date,
    required: true,
  },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
  },
  locationName: {
    type: String,
    default: 'Main Store',
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

// Virtual for stock value
schema.virtual('stockValue').get(function() {
  return this.remainingLength * this.costPerUnit;
});

// Pre-save middleware to handle tail detection
schema.pre('save', function(next) {
  const remainingLength = parseFloat(this.remainingLength);
  const minCutLength = parseFloat(this.minCutLength || 1.0);
  
  // Auto-detect tail if remaining length is less than minimum cut length
  if (remainingLength < minCutLength && remainingLength > 0) {
    this.isTail = true;
    this.status = 'Reserved';
  } else if (remainingLength >= minCutLength) {
    this.isTail = false;
    if (this.status === 'Reserved' && this.isTail === false) {
      this.status = 'Available';
    }
  }
  
  next();
});

// Index for efficient queries
schema.index({ product: 1, status: 1 });
schema.index({ rollNumber: 1 });
schema.index({ barcode: 1 });
schema.index({ isTail: 1, status: 1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('InventoryRoll', schema);
