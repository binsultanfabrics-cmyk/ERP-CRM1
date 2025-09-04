const mongoose = require('mongoose');

const summary = async (Model, req, res) => {
  try {
    // Get product summary with inventory
    const productSummary = await Model.aggregate([
      { $match: { removed: false } },
      {
        $lookup: {
          from: 'inventoryrolls',
          localField: '_id',
          foreignField: 'product',
          as: 'rolls',
        },
      },
      {
        $addFields: {
          totalStock: {
            $sum: '$rolls.remainingLength',
          },
          totalValue: {
            $sum: {
              $map: {
                input: '$rolls',
                as: 'roll',
                in: {
                  $multiply: ['$$roll.remainingLength', '$$roll.costPerUnit'],
                },
              },
            },
          },
          lowStockRolls: {
            $size: {
              $filter: {
                input: '$rolls',
                as: 'roll',
                cond: { $lte: ['$$roll.remainingLength', 5] },
              },
            },
          },
          outOfStockRolls: {
            $size: {
              $filter: {
                input: '$rolls',
                as: 'roll',
                cond: { $lte: ['$$roll.remainingLength', 0] },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$totalStock' },
          totalValue: { $sum: '$totalValue' },
          lowStockProducts: {
            $sum: { $cond: [{ $gt: ['$lowStockRolls', 0] }, 1, 0] },
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $gt: ['$outOfStockRolls', 0] }, 1, 0] },
          },
        },
      },
    ]);

    // Get products by fabric type
    const productsByType = await Model.aggregate([
      { $match: { removed: false } },
      {
        $group: {
          _id: '$fabricType',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get low stock products
    const lowStockProducts = await Model.aggregate([
      { $match: { removed: false } },
      {
        $lookup: {
          from: 'inventoryrolls',
          localField: '_id',
          foreignField: 'product',
          as: 'rolls',
        },
      },
      {
        $addFields: {
          totalStock: {
            $sum: '$rolls.remainingLength',
          },
          lowStockRolls: {
            $size: {
              $filter: {
                input: '$rolls',
                as: 'roll',
                cond: { $lte: ['$$roll.remainingLength', 5] },
              },
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { totalStock: { $lte: 5 } },
            { lowStockRolls: { $gt: 0 } },
          ],
        },
      },
      { $sort: { totalStock: 1 } },
      { $limit: 10 },
    ]);

    const summary = productSummary[0] || {
      totalProducts: 0,
      totalStock: 0,
      totalValue: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
    };

    return res.status(200).json({
      success: true,
      result: {
        summary,
        productsByType,
        lowStockProducts,
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
