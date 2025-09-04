const PosSale = require('@/models/appModels/PosSale');
const Client = require('@/models/appModels/Client');
const Product = require('@/models/appModels/Product');
const InventoryRoll = require('@/models/appModels/InventoryRoll');
const Supplier = require('@/models/appModels/Supplier');
const Invoice = require('@/models/appModels/Invoice');

const getDashboardStats = async (req, res) => {
  try {
    // Get current date and date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregate all stats in parallel
    const [
      salesStats,
      totalCustomers,
      totalProducts,
      totalSuppliers,
      totalInvoices,
      inventoryStats,
      recentSales,
      salesTrend,
      topProducts,
      customerGrowth
    ] = await Promise.all([
      // Total sales stats
      PosSale.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$grandTotal' },
            totalTransactions: { $sum: 1 },
            averageSale: { $avg: '$grandTotal' }
          }
        }
      ]),

      // Total customers
      Client.countDocuments({ removed: false }),

      // Total products
      Product.countDocuments({ removed: false }),

      // Total suppliers
      Supplier.countDocuments({ removed: false }),

      // Total invoices
      Invoice.countDocuments({ removed: false }),

      // Inventory statistics
      InventoryRoll.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalLength: { $sum: '$remainingLength' }
          }
        }
      ]),

      // Recent sales (last 10)
      PosSale.find({ status: 'completed' })
        .populate('customer', 'name')
        .populate('employee', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('receiptNumber grandTotal paymentMethod createdAt customer employee'),

      // Sales trend (last 30 days)
      PosSale.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            totalSales: { $sum: '$grandTotal' },
            transactionCount: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),

      // Top products (last 30 days)
      PosSale.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: '$items.total' },
            salesCount: { $sum: 1 }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
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
            name: '$product.name',
            code: '$product.code',
            fabricType: '$product.fabricType',
            color: '$product.color',
            totalQuantity: 1,
            totalRevenue: 1,
            salesCount: 1
          }
        }
      ]),

      // Customer growth (last 30 days)
      Client.aggregate([
        {
          $match: {
            created: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$created' }
            },
            newCustomers: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    // Process inventory stats
    const inventory = {
      available: 0,
      lowStock: 0,
      outOfStock: 0,
      damaged: 0,
      disposed: 0
    };

    inventoryStats.forEach(stat => {
      const status = stat._id.toLowerCase().replace(/\s+/g, '');
      if (status === 'available') inventory.available = stat.count;
      else if (status === 'lowstock') inventory.lowStock = stat.count;
      else if (status === 'outofstock') inventory.outOfStock = stat.count;
      else if (status === 'damaged') inventory.damaged = stat.count;
      else if (status === 'disposed') inventory.disposed = stat.count;
    });

    // Calculate growth percentages (compare with previous week)
    const currentWeekSales = await PosSale.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$grandTotal' },
          count: { $sum: 1 }
        }
      }
    ]);

    const previousWeekStart = new Date(sevenDaysAgo);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    
    const previousWeekSales = await PosSale.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { 
            $gte: previousWeekStart,
            $lt: sevenDaysAgo
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$grandTotal' },
          count: { $sum: 1 }
        }
      }
    ]);

    const currentWeekTotal = currentWeekSales[0]?.total || 0;
    const previousWeekTotal = previousWeekSales[0]?.total || 0;
    const salesGrowth = previousWeekTotal > 0 
      ? ((currentWeekTotal - previousWeekTotal) / previousWeekTotal * 100).toFixed(1)
      : 0;

    // Format response
    const response = {
      success: true,
      result: {
        // Main KPIs
        totalSales: salesStats[0]?.totalSales || 0,
        totalCustomers,
        totalProducts,
        totalSuppliers,
        totalInvoices,
        totalTransactions: salesStats[0]?.totalTransactions || 0,
        averageSale: salesStats[0]?.averageSale || 0,
        salesGrowth: parseFloat(salesGrowth),

        // Inventory breakdown
        inventory,

        // Charts data
        salesTrend: salesTrend.map(item => ({
          date: item._id,
          sales: item.totalSales,
          transactions: item.transactionCount
        })),

        topProducts: topProducts.map(item => ({
          name: item.name,
          code: item.code,
          fabricType: item.fabricType,
          color: item.color,
          quantity: item.totalQuantity,
          revenue: item.totalRevenue,
          sales: item.salesCount
        })),

        customerGrowth: customerGrowth.map(item => ({
          date: item._id,
          newCustomers: item.newCustomers
        })),

        // Recent transactions
        recentSales: recentSales.map(sale => ({
          id: sale._id,
          receiptNumber: sale.receiptNumber,
          total: sale.grandTotal,
          paymentMethod: sale.paymentMethod,
          date: sale.createdAt,
          customer: sale.customer?.name || 'Walk-in',
          employee: sale.employee?.name || 'Unknown'
        }))
      },
      message: 'Dashboard statistics retrieved successfully'
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
