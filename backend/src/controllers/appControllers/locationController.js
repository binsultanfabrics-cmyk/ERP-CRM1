const mongoose = require('mongoose');
const { catchErrors } = require('@/handlers/errorHandlers');
const { create, read, update, deleteItem, list, search, filter, summary } = require('@/controllers/coreControllers/crudController');
const Location = require('@/models/appModels/Location');
const InventoryRoll = require('@/models/appModels/InventoryRoll');
const StockTxn = require('@/models/appModels/StockTxn');

// Standard CRUD operations
const createLocation = catchErrors(create(Location));
const readLocation = catchErrors(read(Location));
const updateLocation = catchErrors(update(Location));
const deleteLocation = catchErrors(deleteItem(Location));
const listLocations = catchErrors(list(Location));
const searchLocations = catchErrors(search(Location));
const filterLocations = catchErrors(filter(Location));
const summaryLocations = catchErrors(summary(Location));

// Get location inventory summary
const getLocationInventory = catchErrors(async (req, res) => {
  const { locationId } = req.params;
  
  const pipeline = [
    {
      $match: {
        location: new mongoose.Types.ObjectId(locationId),
        status: { $in: ['Available', 'Low Stock', 'Reserved'] },
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
        rollCount: { $count: {} },
        totalValue: { $sum: { $multiply: ['$remainingLength', '$costPerUnit'] } },
        averageCost: { $avg: '$costPerUnit' },
        tailCount: {
          $sum: {
            $cond: [{ $eq: ['$isTail', true] }, 1, 0],
          },
        },
        tailQuantity: {
          $sum: {
            $cond: [{ $eq: ['$isTail', true] }, '$remainingLength', 0],
          },
        },
      },
    },
    { $sort: { totalValue: -1 } },
  ];

  const inventory = await InventoryRoll.aggregate(pipeline);
  
  // Get location details
  const location = await Location.findById(locationId);
  
  res.status(200).json({
    success: true,
    result: {
      location,
      inventory,
      summary: {
        totalItems: inventory.length,
        totalRolls: inventory.reduce((sum, item) => sum + item.rollCount, 0),
        totalValue: inventory.reduce((sum, item) => sum + parseFloat(item.totalValue), 0),
        totalTails: inventory.reduce((sum, item) => sum + item.tailCount, 0),
      },
    },
    message: 'Location inventory retrieved successfully',
  });
});

// Transfer stock between locations
const transferStock = catchErrors(async (req, res) => {
  const { fromLocationId, toLocationId, items, notes } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate locations
    const [fromLocation, toLocation] = await Promise.all([
      Location.findById(fromLocationId).session(session),
      Location.findById(toLocationId).session(session),
    ]);

    if (!fromLocation || !toLocation) {
      throw new Error('Invalid location specified');
    }

    if (fromLocationId === toLocationId) {
      throw new Error('Cannot transfer to the same location');
    }

    const transferResults = [];

    // Process each item transfer
    for (const item of items) {
      const { rollId, quantity } = item;
      
      // Get the inventory roll
      const roll = await InventoryRoll.findById(rollId).session(session);
      if (!roll) {
        throw new Error(`Roll not found: ${rollId}`);
      }

      if (roll.location.toString() !== fromLocationId) {
        throw new Error(`Roll ${roll.rollNumber} is not in the specified source location`);
      }

      const remainingLength = parseFloat(roll.remainingLength);
      if (quantity > remainingLength) {
        throw new Error(`Insufficient quantity in roll ${roll.rollNumber}`);
      }

      // Update roll location and quantity
      const newRemainingLength = remainingLength - quantity;
      
      if (newRemainingLength === 0) {
        // Move entire roll to new location
        roll.location = toLocationId;
        roll.locationName = toLocation.name;
      } else {
        // Create new roll for transferred quantity
        const newRoll = new InventoryRoll({
          rollNumber: `ROLL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          product: roll.product,
          supplier: roll.supplier,
          batchNumber: roll.batchNumber,
          initLength: quantity.toString(),
          remainingLength: quantity.toString(),
          unit: roll.unit,
          status: roll.status,
          isTail: roll.isTail,
          minCutLength: roll.minCutLength,
          costPerUnit: roll.costPerUnit,
          receivedAt: roll.receivedAt,
          location: toLocationId,
          locationName: toLocation.name,
          notes: `Transferred from ${fromLocation.name}`,
          createdBy: userId,
        });

        await newRoll.save({ session });

        // Update original roll
        roll.remainingLength = newRemainingLength.toString();
        await roll.save({ session });

        // Create stock transaction for new roll
        const newStockTxn = new StockTxn({
          type: 'IN',
          product: roll.product,
          roll: newRoll._id,
          qty: quantity.toString(),
          unit: roll.unit,
          refType: 'Transfer',
          refId: newRoll._id,
          refModel: 'StockTransfer',
          fromLocation: fromLocationId,
          toLocation: toLocationId,
          unitCost: roll.costPerUnit,
          totalValue: (quantity * parseFloat(roll.costPerUnit)).toString(),
          notes: `Stock transfer from ${fromLocation.name} to ${toLocation.name}`,
          createdBy: userId,
        });

        await newStockTxn.save({ session });
      }

      // Create stock transaction for transfer out
      const outStockTxn = new StockTxn({
        type: 'OUT',
        product: roll.product,
        roll: roll._id,
        qty: quantity.toString(),
        unit: roll.unit,
        refType: 'Transfer',
        refId: roll._id,
        refModel: 'StockTransfer',
        fromLocation: fromLocationId,
        toLocation: toLocationId,
        unitCost: roll.costPerUnit,
        totalValue: (quantity * parseFloat(roll.costPerUnit)).toString(),
        notes: `Stock transfer from ${fromLocation.name} to ${toLocation.name}`,
        createdBy: userId,
      });

      await outStockTxn.save({ session });

      transferResults.push({
        rollId: roll._id,
        rollNumber: roll.rollNumber,
        quantity,
        fromLocation: fromLocation.name,
        toLocation: toLocation.name,
      });
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      result: {
        transferResults,
        fromLocation: fromLocation.name,
        toLocation: toLocation.name,
        totalItems: items.length,
      },
      message: 'Stock transfer completed successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Get transfer history
const getTransferHistory = catchErrors(async (req, res) => {
  const { locationId, startDate, endDate, limit = 50 } = req.query;
  
  const matchStage = {
    refModel: 'StockTransfer',
  };

  if (locationId) {
    matchStage.$or = [
      { fromLocation: new mongoose.Types.ObjectId(locationId) },
      { toLocation: new mongoose.Types.ObjectId(locationId) },
    ];
  }

  if (startDate && endDate) {
    matchStage.created = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'locations',
        localField: 'fromLocation',
        foreignField: '_id',
        as: 'fromLocation',
      },
    },
    {
      $lookup: {
        from: 'locations',
        localField: 'toLocation',
        foreignField: '_id',
        as: 'toLocation',
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
    {
      $project: {
        type: 1,
        qty: 1,
        unit: 1,
        totalValue: 1,
        notes: 1,
        created: 1,
        fromLocationName: { $arrayElemAt: ['$fromLocation.name', 0] },
        toLocationName: { $arrayElemAt: ['$toLocation.name', 0] },
        productName: { $arrayElemAt: ['$product.name', 0] },
        productCode: { $arrayElemAt: ['$product.code', 0] },
      },
    },
    { $sort: { created: -1 } },
    { $limit: parseInt(limit) },
  ];

  const transfers = await StockTxn.aggregate(pipeline);

  res.status(200).json({
    success: true,
    result: transfers,
    message: 'Transfer history retrieved successfully',
  });
});

module.exports = {
  create: createLocation,
  read: readLocation,
  update: updateLocation,
  delete: deleteLocation,
  list: listLocations,
  search: searchLocations,
  filter: filterLocations,
  summary: summaryLocations,
  getInventory: getLocationInventory,
  transferStock,
  getTransferHistory,
};
