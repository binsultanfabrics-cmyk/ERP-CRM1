const mongoose = require('mongoose');
const { catchErrors } = require('@/handlers/errorHandlers');
const PosSale = require('@/models/appModels/PosSale');
const PurchaseOrder = require('@/models/appModels/PurchaseOrder');
const BargainLog = require('@/models/appModels/BargainLog');
const LedgerEntry = require('@/models/appModels/LedgerEntry');
const InventoryRoll = require('@/models/appModels/InventoryRoll');
const Product = require('@/models/appModels/Product');

// Daily Sales Summary
const getDailySalesSummary = catchErrors(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const matchStage = {
    status: 'completed',
  };
  
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalSales: { $sum: '$grandTotal' },
        totalTransactions: { $count: {} },
        averageSale: { $avg: '$grandTotal' },
        totalDiscount: { $sum: { $add: ['$discount', '$bargainDiscount'] } },
        totalTax: { $sum: '$tax' },
        totalItems: { $sum: { $size: '$items' } },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
  ];

  const results = await PosSale.aggregate(pipeline);
  
  res.status(200).json({
    success: true,
    result: results,
    message: 'Daily sales summary retrieved successfully',
  });
});

// Monthly Profit & Loss
const getMonthlyProfitLoss = catchErrors(async (req, res) => {
  const { year, month } = req.query;
  
  const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) - 1, 1);
  const endDate = new Date(year || new Date().getFullYear(), month || new Date().getMonth(), 0, 23, 59, 59);

  // Sales revenue
  const salesPipeline = [
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$grandTotal' },
        totalCost: { $sum: { $multiply: ['$subtotal', 0.7] } }, // Assuming 70% cost ratio
        totalDiscount: { $sum: { $add: ['$discount', '$bargainDiscount'] } },
        totalTax: { $sum: '$tax' },
      },
    },
  ];

  // Purchase costs
  const purchasePipeline = [
    {
      $match: {
        status: { $in: ['Received', 'Closed'] },
        actualDeliveryDate: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalPurchases: { $sum: '$totalAmount' },
      },
    },
  ];

  // Operating expenses (from ledger)
  const expensesPipeline = [
    {
      $match: {
        entryType: { $in: ['Salary', 'Commission', 'Adjustment'] },
        date: { $gte: startDate, $lte: endDate },
        debit: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: '$debit' },
      },
    },
  ];

  const [salesData, purchaseData, expenseData] = await Promise.all([
    PosSale.aggregate(salesPipeline),
    PurchaseOrder.aggregate(purchasePipeline),
    LedgerEntry.aggregate(expensesPipeline),
  ]);

  const sales = salesData[0] || { totalRevenue: 0, totalCost: 0, totalDiscount: 0, totalTax: 0 };
  const purchases = purchaseData[0] || { totalPurchases: 0 };
  const expenses = expenseData[0] || { totalExpenses: 0 };

  const grossProfit = sales.totalRevenue - sales.totalCost;
  const netProfit = grossProfit - expenses.totalExpenses;

  res.status(200).json({
    success: true,
    result: {
      period: { startDate, endDate },
      revenue: {
        totalSales: sales.totalRevenue,
        totalDiscount: sales.totalDiscount,
        totalTax: sales.totalTax,
        netRevenue: sales.totalRevenue - sales.totalDiscount,
      },
      costs: {
        costOfGoodsSold: sales.totalCost,
        purchases: purchases.totalPurchases,
      },
      expenses: {
        operatingExpenses: expenses.totalExpenses,
      },
      profit: {
        grossProfit,
        netProfit,
        profitMargin: sales.totalRevenue > 0 ? (netProfit / sales.totalRevenue) * 100 : 0,
      },
    },
    message: 'Monthly profit & loss retrieved successfully',
  });
});

// Top Selling Items
const getTopSellingItems = catchErrors(async (req, res) => {
  const { startDate, endDate, limit = 10 } = req.query;
  
  const matchStage = { status: 'completed' };
  if (startDate && endDate) {
    matchStage.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const pipeline = [
    { $match: matchStage },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.total' },
        averagePrice: { $avg: '$items.unitPrice' },
        saleCount: { $sum: 1 },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        productName: '$product.name',
        productCode: '$product.code',
        fabricType: '$product.fabricType',
        color: '$product.color',
        totalQuantity: 1,
        totalRevenue: 1,
        averagePrice: 1,
        saleCount: 1,
      },
    },
  ];

  const results = await PosSale.aggregate(pipeline);
  
  res.status(200).json({
    success: true,
    result: results,
    message: 'Top selling items retrieved successfully',
  });
});

// Bargain Impact Report
const getBargainImpactReport = catchErrors(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.created = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: {
          approvalLevel: '$approvalLevel',
          staff: '$staff',
        },
        totalDiscounts: { $sum: '$discountAmount' },
        totalTransactions: { $count: {} },
        averageDiscount: { $avg: '$discountAmount' },
        averageDiscountPct: { $avg: '$discountPct' },
      },
    },
    {
      $lookup: {
        from: 'employees',
        localField: '_id.staff',
        foreignField: '_id',
        as: 'employee',
      },
    },
    { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        approvalLevel: '$_id.approvalLevel',
        employeeName: '$employee.name',
        employeeRole: '$employee.role',
        totalDiscounts: 1,
        totalTransactions: 1,
        averageDiscount: 1,
        averageDiscountPct: 1,
      },
    },
    { $sort: { totalDiscounts: -1 } },
  ];

  const results = await BargainLog.aggregate(pipeline);
  
  res.status(200).json({
    success: true,
    result: results,
    message: 'Bargain impact report retrieved successfully',
  });
});

// Credit Aging Report
const getCreditAgingReport = catchErrors(async (req, res) => {
  const pipeline = [
    {
      $match: {
        partyType: { $in: ['Customer', 'Supplier'] },
        balance: { $ne: 0 },
      },
    },
    {
      $group: {
        _id: {
          partyType: '$partyType',
          partyId: '$partyId',
        },
        currentBalance: { $last: '$balance' },
        lastTransactionDate: { $max: '$date' },
        totalDebit: { $sum: '$debit' },
        totalCredit: { $sum: '$credit' },
      },
    },
    {
      $lookup: {
        from: 'clients',
        localField: '_id.partyId',
        foreignField: '_id',
        as: 'customer',
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: '_id.partyId',
        foreignField: '_id',
        as: 'supplier',
      },
    },
    {
      $project: {
        partyType: '$_id.partyType',
        partyId: '$_id.partyId',
        partyName: {
          $cond: {
            if: { $eq: ['$_id.partyType', 'Customer'] },
            then: { $arrayElemAt: ['$customer.name', 0] },
            else: { $arrayElemAt: ['$supplier.name', 0] },
          },
        },
        currentBalance: 1,
        lastTransactionDate: 1,
        totalDebit: 1,
        totalCredit: 1,
        daysSinceLastTransaction: {
          $divide: [
            { $subtract: [new Date(), '$lastTransactionDate'] },
            1000 * 60 * 60 * 24,
          ],
        },
      },
    },
    {
      $addFields: {
        agingBucket: {
          $switch: {
            branches: [
              { case: { $lte: ['$daysSinceLastTransaction', 30] }, then: '0-30' },
              { case: { $lte: ['$daysSinceLastTransaction', 60] }, then: '31-60' },
              { case: { $lte: ['$daysSinceLastTransaction', 90] }, then: '61-90' },
            ],
            default: '90+',
          },
        },
      },
    },
    { $sort: { currentBalance: -1 } },
  ];

  const results = await LedgerEntry.aggregate(pipeline);
  
  // Group by aging buckets
  const agingSummary = results.reduce((acc, item) => {
    const bucket = item.agingBucket;
    if (!acc[bucket]) {
      acc[bucket] = { count: 0, totalAmount: 0, items: [] };
    }
    acc[bucket].count += 1;
    acc[bucket].totalAmount += parseFloat(item.currentBalance);
    acc[bucket].items.push(item);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    result: {
      summary: agingSummary,
      details: results,
    },
    message: 'Credit aging report retrieved successfully',
  });
});

// Employee Sales Report
const getEmployeeSalesReport = catchErrors(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const matchStage = { status: 'completed' };
  if (startDate && endDate) {
    matchStage.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: '$employee',
        totalSales: { $sum: '$grandTotal' },
        totalTransactions: { $count: {} },
        averageSale: { $avg: '$grandTotal' },
        totalItems: { $sum: { $size: '$items' } },
        totalDiscount: { $sum: { $add: ['$discount', '$bargainDiscount'] } },
      },
    },
    {
      $lookup: {
        from: 'employees',
        localField: '_id',
        foreignField: '_id',
        as: 'employee',
      },
    },
    { $unwind: '$employee' },
    {
      $project: {
        employeeName: '$employee.name',
        employeeRole: '$employee.role',
        employeeId: '$employee.employeeId',
        totalSales: 1,
        totalTransactions: 1,
        averageSale: 1,
        totalItems: 1,
        totalDiscount: 1,
      },
    },
    { $sort: { totalSales: -1 } },
  ];

  const results = await PosSale.aggregate(pipeline);
  
  res.status(200).json({
    success: true,
    result: results,
    message: 'Employee sales report retrieved successfully',
  });
});

// Inventory Valuation Report
const getInventoryValuationReport = catchErrors(async (req, res) => {
  const pipeline = [
    {
      $match: {
        status: { $in: ['Available', 'Low Stock'] },
        remainingLength: { $gt: 0 },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product._id',
        productName: { $first: '$product.name' },
        productCode: { $first: '$product.code' },
        fabricType: { $first: '$product.fabricType' },
        color: { $first: '$product.color' },
        totalQuantity: { $sum: '$remainingLength' },
        averageCost: { $avg: '$costPerUnit' },
        totalValue: { $sum: { $multiply: ['$remainingLength', '$costPerUnit'] } },
        rollCount: { $count: {} },
      },
    },
    { $sort: { totalValue: -1 } },
  ];

  const results = await InventoryRoll.aggregate(pipeline);
  
  const totalValue = results.reduce((sum, item) => sum + parseFloat(item.totalValue), 0);
  
  res.status(200).json({
    success: true,
    result: {
      items: results,
      summary: {
        totalItems: results.length,
        totalValue,
        averageValue: results.length > 0 ? totalValue / results.length : 0,
      },
    },
    message: 'Inventory valuation report retrieved successfully',
  });
});

module.exports = {
  getDailySalesSummary,
  getMonthlyProfitLoss,
  getTopSellingItems,
  getBargainImpactReport,
  getCreditAgingReport,
  getEmployeeSalesReport,
  getInventoryValuationReport,
};
