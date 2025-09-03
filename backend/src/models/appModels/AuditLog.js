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
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT'],
  },
  entity: {
    type: String,
    required: true,
  },
  entityId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries
schema.index({ action: 1, created: -1 });
schema.index({ entity: 1, entityId: 1, created: -1 });
schema.index({ userId: 1, created: -1 });
schema.index({ severity: 1, created: -1 });
schema.index({ created: -1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('AuditLog', schema);
