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
  type: {
    type: String,
    required: true,
    enum: ['Warehouse', 'Store', 'Showroom', 'Office', 'Other'],
    default: 'Warehouse',
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  contact: {
    phone: String,
    email: String,
    manager: String,
  },
  capacity: {
    maxRolls: {
      type: Number,
      default: 1000,
    },
    maxValue: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
  },
  settings: {
    allowNegativeStock: {
      type: Boolean,
      default: false,
    },
    requireApprovalForTransfer: {
      type: Boolean,
      default: true,
    },
    autoReorder: {
      type: Boolean,
      default: false,
    },
    reorderLevel: {
      type: Number,
      default: 10,
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  notes: String,
  createdBy: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'Admin',
    required: function() {
      return !this.isDefault;
    },
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

// Pre-save middleware to ensure only one default location
schema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Indexes
schema.index({ code: 1 });
schema.index({ type: 1 });
schema.index({ isDefault: 1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Location', schema);
