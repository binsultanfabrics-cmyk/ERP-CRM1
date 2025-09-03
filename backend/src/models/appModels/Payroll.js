const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Base Salary', 'Commission', 'Bonus', 'Overtime', 'Allowance'],
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  description: String,
});

const deductionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Tax', 'Insurance', 'Loan', 'Advance', 'Other'],
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  description: String,
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
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: true,
  },
  period: {
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  earnings: [earningSchema],
  deductions: [deductionSchema],
  totalEarnings: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  totalDeductions: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  netPay: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Check'],
  },
  paymentReference: String,
  salesTarget: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  actualSales: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  commissionEarned: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
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
schema.index({ employee: 1, 'period.month': 1, 'period.year': 1 });
schema.index({ paid: 1, created: -1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Payroll', schema);
