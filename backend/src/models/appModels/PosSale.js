const mongoose = require('mongoose');
const { Schema } = mongoose;

const posSaleSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: false // Can be walk-in customer
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    items: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      roll: {
        type: Schema.Types.ObjectId,
        ref: 'InventoryRoll',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        required: true,
        default: 'm'
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0
      },
      total: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    bargainDiscount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'Credit Card', 'Bank Transfer', 'Mobile Payment', 'Credit']
    },
    receivedAmount: {
      type: Number,
      required: true,
      min: 0
    },
    change: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'cancelled', 'refunded'],
      default: 'completed'
    },
    notes: {
      type: String,
      trim: true
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    saleNumber: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

// Generate receipt number before saving
posSaleSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const count = await this.constructor.countDocuments();
    this.receiptNumber = `POS-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Generate barcode before saving
posSaleSchema.pre('save', async function(next) {
  if (!this.barcode) {
    this.barcode = `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Generate sale number before saving
posSaleSchema.pre('save', async function(next) {
  if (!this.saleNumber) {
    const count = await this.constructor.countDocuments();
    this.saleNumber = `SALE-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Virtual for total discount
posSaleSchema.virtual('totalDiscount').get(function() {
  return this.discount + this.bargainDiscount;
});

// Virtual for net amount before tax
posSaleSchema.virtual('netAmount').get(function() {
  return this.subtotal - this.totalDiscount;
});

// Indexes for better query performance
posSaleSchema.index({ date: -1 });
posSaleSchema.index({ customer: 1 });
posSaleSchema.index({ employee: 1 });
posSaleSchema.index({ status: 1 });
posSaleSchema.index({ receiptNumber: 1 });
posSaleSchema.index({ barcode: 1 });

// Static method to get sales statistics
posSaleSchema.statics.getSalesStats = async function(startDate, endDate) {
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$grandTotal' },
        totalTransactions: { $count: {} },
        averageSale: { $avg: '$grandTotal' },
        totalDiscount: { $sum: '$totalDiscount' },
        totalTax: { $sum: '$tax' }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalSales: 0,
    totalTransactions: 0,
    averageSale: 0,
    totalDiscount: 0,
    totalTax: 0
  };
};

// Static method to get top selling products
posSaleSchema.statics.getTopSellingProducts = async function(startDate, endDate, limit = 10) {
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const pipeline = [
    { $match: matchStage },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.total' },
        saleCount: { $sum: 1 }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        productName: '$product.name',
        productCode: '$product.code',
        totalQuantity: 1,
        totalRevenue: 1,
        saleCount: 1
      }
    }
  ];

  return await this.aggregate(pipeline);
};

module.exports = mongoose.model('PosSale', posSaleSchema);
