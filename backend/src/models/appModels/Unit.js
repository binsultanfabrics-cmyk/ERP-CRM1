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
    enum: ['m', 'yd', 'ft', 'cm'],
  },
  name: {
    type: String,
    required: true,
  },
  precision: {
    type: Number,
    default: 2,
    min: 0,
    max: 4,
  },
  ratioToBase: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: 1.0,
  },
  isBaseUnit: {
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

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Unit', schema);
