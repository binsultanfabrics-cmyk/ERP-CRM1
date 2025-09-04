const mongoose = require('mongoose');
const PosSale = require('../../../models/appModels/PosSale');
const PosSettings = require('../../../models/appModels/PosSettings');
const InventoryRoll = require('../../../models/appModels/InventoryRoll');
const StockTxn = require('../../../models/appModels/StockTxn');
const LedgerEntry = require('../../../models/appModels/LedgerEntry');
const { create: createCrud } = require('../../middlewaresControllers/createCRUDController');

const create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customer,
      employee,
      items,
      subtotal,
      discount,
      bargainDiscount,
      tax,
      grandTotal,
      paymentMethod,
      receivedAmount,
      change,
      notes
    } = req.body;

    // Validate required fields
    if (!employee || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Employee and items are required'
      });
    }

    // Validate stock availability
    for (const item of items) {
      const roll = await InventoryRoll.findById(item.roll).session(session);
      if (!roll || roll.remainingLength < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          result: null,
          message: `Insufficient stock for roll ${roll?.barcode || item.roll}`
        });
      }
    }

    // Create POS sale
    const saleData = {
      customer,
      employee,
      items,
      subtotal,
      discount: discount || 0,
      bargainDiscount: bargainDiscount || 0,
      tax: tax || 0,
      grandTotal,
      paymentMethod,
      receivedAmount,
      change: change || 0,
      notes,
      date: new Date(),
      status: 'completed'
    };

    const posSale = new PosSale(saleData);
    await posSale.save({ session });

    // Update inventory rolls and create stock transactions
    for (const item of items) {
      // Update roll remaining length
      await InventoryRoll.findByIdAndUpdate(
        item.roll,
        { $inc: { remainingLength: -item.quantity } },
        { session }
      );

      // Create stock transaction
      const stockTxn = new StockTxn({
        product: item.product,
        roll: item.roll,
        type: 'OUT',
        quantity: item.quantity,
        unit: item.unit,
        reason: 'POS Sale',
        reference: posSale._id,
        date: new Date(),
        notes: `POS Sale - ${posSale.receiptNumber}`
      });
      await stockTxn.save({ session });
    }

    // Create ledger entry if customer exists
    if (customer) {
      const ledgerEntry = new LedgerEntry({
        client: customer,
        type: 'sale',
        amount: grandTotal,
        reference: posSale._id,
        date: new Date(),
        notes: `POS Sale - ${posSale.receiptNumber}`
      });
      await ledgerEntry.save({ session });
    }

    await session.commitTransaction();

    // Populate references for response
    await posSale.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'employee', select: 'name position' },
      { path: 'items.product', select: 'name code' },
      { path: 'items.roll', select: 'barcode batchNumber' }
    ]);

    res.status(200).json({
      success: true,
      result: posSale,
      message: 'POS sale created successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('POS Sale Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to create POS sale',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

const list = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      startDate,
      endDate,
      status,
      customer,
      employee,
      paymentMethod
    } = req.query;

    // Build query
    const query = { removed: false };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (status) query.status = status;
    if (customer) query.customer = customer;
    if (employee) query.employee = employee;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const skip = (page - 1) * limit;
    const posSales = await PosSale.find(query)
      .populate([
        { path: 'customer', select: 'name email phone' },
        { path: 'employee', select: 'name position' },
        { path: 'items.product', select: 'name code' },
        { path: 'items.roll', select: 'barcode batchNumber' }
      ])
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PosSale.countDocuments(query);

    res.status(200).json({
      success: true,
      result: {
        items: posSales,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      message: 'POS sales retrieved successfully'
    });

  } catch (error) {
    console.error('POS List Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve POS sales',
      error: error.message
    });
  }
};

const read = async (req, res) => {
  try {
    const { id } = req.params;
    
    const posSale = await PosSale.findById(id)
      .populate([
        { path: 'customer', select: 'name email phone address' },
        { path: 'employee', select: 'name position' },
        { path: 'items.product', select: 'name code pricing' },
        { path: 'items.roll', select: 'barcode batchNumber location' }
      ]);

    if (!posSale) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'POS sale not found'
      });
    }

    res.status(200).json({
      success: true,
      result: posSale,
      message: 'POS sale retrieved successfully'
    });

  } catch (error) {
    console.error('POS Read Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve POS sale',
      error: error.message
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Don't allow updating critical fields
    delete updateData.items;
    delete updateData.subtotal;
    delete updateData.grandTotal;
    delete updateData.date;

    const posSale = await PosSale.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'employee', select: 'name position' },
      { path: 'items.product', select: 'name code' },
      { path: 'items.roll', select: 'barcode batchNumber' }
    ]);

    if (!posSale) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'POS sale not found'
      });
    }

    res.status(200).json({
      success: true,
      result: posSale,
      message: 'POS sale updated successfully'
    });

  } catch (error) {
    console.error('POS Update Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to update POS sale',
      error: error.message
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const posSale = await PosSale.findByIdAndUpdate(
      id,
      { removed: true },
      { new: true }
    );

    if (!posSale) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'POS sale not found'
      });
    }

    res.status(200).json({
      success: true,
      result: posSale,
      message: 'POS sale removed successfully'
    });

  } catch (error) {
    console.error('POS Remove Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to remove POS sale',
      error: error.message
    });
  }
};

const getSalesStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await PosSale.getSalesStats(startDate, endDate);
    
    res.status(200).json({
      success: true,
      result: stats,
      message: 'Sales statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Sales Stats Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve sales statistics',
      error: error.message
    });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    const products = await PosSale.getTopSellingProducts(startDate, endDate, parseInt(limit));
    
    res.status(200).json({
      success: true,
      result: products,
      message: 'Top selling products retrieved successfully'
    });

  } catch (error) {
    console.error('Top Products Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve top selling products',
      error: error.message
    });
  }
};

const cancelSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { reason } = req.body;

    const posSale = await PosSale.findById(id).session(session);
    if (!posSale) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        result: null,
        message: 'POS sale not found'
      });
    }

    if (posSale.status !== 'completed') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Only completed sales can be cancelled'
      });
    }

    // Update sale status
    posSale.status = 'cancelled';
    posSale.notes = reason ? `${posSale.notes || ''}\nCancelled: ${reason}` : posSale.notes;
    await posSale.save({ session });

    // Restore inventory
    for (const item of posSale.items) {
      await InventoryRoll.findByIdAndUpdate(
        item.roll,
        { $inc: { remainingLength: item.quantity } },
        { session }
      );

      // Create stock transaction for cancellation
      const stockTxn = new StockTxn({
        product: item.product,
        roll: item.roll,
        type: 'IN',
        quantity: item.quantity,
        unit: item.unit,
        reason: 'Sale Cancellation',
        reference: posSale._id,
        date: new Date(),
        notes: `POS Sale Cancelled - ${posSale.receiptNumber}`
      });
      await stockTxn.save({ session });
    }

    // Reverse ledger entry if customer exists
    if (posSale.customer) {
      const ledgerEntry = new LedgerEntry({
        client: posSale.customer,
        type: 'refund',
        amount: posSale.grandTotal,
        reference: posSale._id,
        date: new Date(),
        notes: `POS Sale Cancelled - ${posSale.receiptNumber}`
      });
      await ledgerEntry.save({ session });
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      result: posSale,
      message: 'POS sale cancelled successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Cancel Sale Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to cancel POS sale',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  create,
  list,
  read,
  update,
  remove,
  getSalesStats,
  getTopSellingProducts,
  cancelSale
};
