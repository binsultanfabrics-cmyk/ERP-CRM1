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
  fabricType: {
    type: String,
    required: true,
    enum: ['Cotton', 'Silk', 'Wool', 'Polyester', 'Linen', 'Denim', 'Velvet', 'Other'],
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'Standard',
  },
  description: String,
  images: [String],
  pricing: {
    minSalePrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    maxSalePrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    defaultUnit: {
      type: String,
      required: true,
      enum: ['m', 'yd'],
    },
    costPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  category: {
    type: String,
    default: 'Fabric',
  },
  tags: [String],
  barcode: String,
  sku: String,
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

module.exports = mongoose.model('Product', schema);
