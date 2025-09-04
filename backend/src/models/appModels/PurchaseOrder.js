const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ['m', 'yd'],
  },
  unitPrice: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  totalPrice: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  receivedQuantity: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  remainingQuantity: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
});

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  poNumber: {
    type: String,
    required: true,
    unique: true,
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    required: true,
    autopopulate: true,
  },
  items: [purchaseOrderItemSchema],
  status: {
    type: String,
    required: true,
    enum: ['Created', 'Ordered', 'Partially Received', 'Received', 'Closed', 'Cancelled'],
    default: 'Created',
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expectedDeliveryDate: {
    type: Date,
  },
  actualDeliveryDate: {
    type: Date,
  },
  subtotal: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: 0,
  },
  taxRate: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  taxAmount: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  totalAmount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: 0,
  },
  notes: String,
  terms: String,
  createdBy: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'Admin',
    required: true,
  },
  approvedBy: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'Admin',
  },
  approvedAt: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to generate PO number
schema.pre('save', async function(next) {
  if (this.isNew && !this.poNumber) {
    const count = await this.constructor.countDocuments();
    this.poNumber = `PO-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Virtual for completion percentage
schema.virtual('completionPercentage').get(function() {
  if (!this.items || this.items.length === 0) return 0;
  
  const totalOrdered = this.items.reduce((sum, item) => 
    sum + parseFloat(item.quantity), 0);
  const totalReceived = this.items.reduce((sum, item) => 
    sum + parseFloat(item.receivedQuantity || 0), 0);
  
  return totalOrdered > 0 ? (totalReceived / totalOrdered) * 100 : 0;
});

// Indexes for efficient queries
schema.index({ poNumber: 1 });
schema.index({ supplier: 1, status: 1 });
schema.index({ status: 1, orderDate: -1 });
schema.index({ createdBy: 1, created: -1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('PurchaseOrder', schema);
