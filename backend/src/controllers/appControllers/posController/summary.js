const mongoose = require('mongoose');
const moment = require('moment');

const summary = async (Model, req, res) => {
  try {
    const { startDate, endDate, staff, customer } = req.query;
    
    let filter = { removed: false };
    
    if (startDate && endDate) {
      filter.date = {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate(),
      };
    }
    
    if (staff) {
      filter.staff = staff;
    }
    
    if (customer) {
      filter.customer = customer;
    }

    // Get sales summary
    const salesSummary = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$grandTotal' },
          totalItems: { $sum: { $size: '$items' } },
          totalDiscount: { $sum: '$totalDiscount' },
          totalTax: { $sum: '$totalTax' },
          totalPaid: { $sum: '$totalPaid' },
          totalBalance: { $sum: '$balance' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get daily sales for chart
    const dailySales = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          sales: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top selling products
    const topProducts = await Model.aggregate([
      { $match: filter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQty: { $sum: '$items.qty' },
          totalValue: { $sum: '$items.total' },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: 10 },
    ]);

    // Get staff performance
    const staffPerformance = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$staff',
          totalSales: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    // Get payment method distribution
    const paymentMethods = await Model.aggregate([
      { $match: filter },
      { $unwind: '$payments' },
      {
        $group: {
          _id: '$payments.method',
          total: { $sum: '$payments.amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const summary = salesSummary[0] || {
      totalSales: 0,
      totalItems: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalPaid: 0,
      totalBalance: 0,
      count: 0,
    };

    return res.status(200).json({
      success: true,
      result: {
        summary,
        dailySales,
        topProducts,
        staffPerformance,
        paymentMethods,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = summary;
