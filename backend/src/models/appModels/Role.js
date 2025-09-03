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
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  permissions: [{
    type: String,
    required: true,
  }],
  isSystemRole: {
    type: Boolean,
    default: false,
  },
  createdBy: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'Admin',
    required: function() {
      return !this.isSystemRole;
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

// Indexes
schema.index({ name: 1 });
schema.index({ isSystemRole: 1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Role', schema);
