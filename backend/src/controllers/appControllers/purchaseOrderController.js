const mongoose = require('mongoose');
const { catchErrors } = require('@/handlers/errorHandlers');
const { create, read, update, deleteItem, list, search, filter, summary } = require('@/controllers/coreControllers/crudController');
const PurchaseOrder = require('@/models/appModels/PurchaseOrder');
const InventoryRoll = require('@/models/appModels/InventoryRoll');
const StockTxn = require('@/models/appModels/StockTxn');
const LedgerEntry = require('@/models/appModels/LedgerEntry');

// Standard CRUD operations
const createPurchaseOrder = catchErrors(create(PurchaseOrder));
const readPurchaseOrder = catchErrors(read(PurchaseOrder));
const updatePurchaseOrder = catchErrors(update(PurchaseOrder));
const deletePurchaseOrder = catchErrors(deleteItem(PurchaseOrder));
const listPurchaseOrders = catchErrors(list(PurchaseOrder));
const searchPurchaseOrders = catchErrors(search(PurchaseOrder));
const filterPurchaseOrders = catchErrors(filter(PurchaseOrder));
const summaryPurchaseOrders = catchErrors(summary(PurchaseOrder));

// Custom operations
const updatePurchaseOrderStatus = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchaseOrder = await PurchaseOrder.findById(id).session(session);
    if (!purchaseOrder) {
      throw new Error('Purchase order not found');
    }

    // Validate status transition
    const validTransitions = {
      'Created': ['Ordered', 'Cancelled'],
      'Ordered': ['Partially Received', 'Received', 'Cancelled'],
      'Partially Received': ['Received', 'Closed'],
      'Received': ['Closed'],
      'Closed': [],
      'Cancelled': []
    };

    if (!validTransitions[purchaseOrder.status].includes(status)) {
      throw new Error(`Invalid status transition from ${purchaseOrder.status} to ${status}`);
    }

    // Update status
    purchaseOrder.status = status;
    purchaseOrder.updated = new Date();
    
    if (status === 'Ordered') {
      purchaseOrder.approvedBy = userId;
      purchaseOrder.approvedAt = new Date();
    }

    if (notes) {
      purchaseOrder.notes = notes;
    }

    await purchaseOrder.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      result: purchaseOrder,
      message: 'Purchase order status updated successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const receivePurchaseOrder = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { receivedItems, notes } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchaseOrder = await PurchaseOrder.findById(id).session(session);
    if (!purchaseOrder) {
      throw new Error('Purchase order not found');
    }

    if (purchaseOrder.status === 'Closed' || purchaseOrder.status === 'Cancelled') {
      throw new Error('Cannot receive items for closed or cancelled purchase order');
    }

    let totalReceivedValue = 0;
    const newInventoryRolls = [];
    const newStockTxns = [];

    // Process each received item
    for (const receivedItem of receivedItems) {
      const poItem = purchaseOrder.items.id(receivedItem.itemId);
      if (!poItem) {
        throw new Error(`Item not found in purchase order: ${receivedItem.itemId}`);
      }

      const receivedQty = parseFloat(receivedItem.quantity);
      const remainingQty = parseFloat(poItem.remainingQuantity);

      if (receivedQty > remainingQty) {
        throw new Error(`Received quantity (${receivedQty}) exceeds remaining quantity (${remainingQty}) for item ${poItem.product}`);
      }

      // Update PO item
      poItem.receivedQuantity = (parseFloat(poItem.receivedQuantity || 0) + receivedQty).toString();
      poItem.remainingQuantity = (remainingQty - receivedQty).toString();

      // Create inventory roll
      const inventoryRoll = new InventoryRoll({
        rollNumber: `ROLL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        product: poItem.product,
        supplier: purchaseOrder.supplier,
        batchNumber: receivedItem.batchNumber || `BATCH-${Date.now()}`,
        initLength: receivedQty.toString(),
        remainingLength: receivedQty.toString(),
        unit: poItem.unit,
        status: 'Available',
        costPerUnit: poItem.unitPrice,
        receivedAt: new Date(),
        location: receivedItem.location || 'Main Store',
        notes: notes,
        createdBy: userId,
      });

      await inventoryRoll.save({ session });
      newInventoryRolls.push(inventoryRoll);

      // Create stock transaction
      const stockTxn = new StockTxn({
        type: 'IN',
        product: poItem.product,
        roll: inventoryRoll._id,
        qty: receivedQty.toString(),
        unit: poItem.unit,
        refType: 'Purchase',
        refId: purchaseOrder._id,
        refModel: 'PurchaseOrder',
        unitCost: poItem.unitPrice,
        totalValue: (receivedQty * parseFloat(poItem.unitPrice)).toString(),
        notes: `Received from PO ${purchaseOrder.poNumber}`,
        createdBy: userId,
      });

      await stockTxn.save({ session });
      newStockTxns.push(stockTxn);

      totalReceivedValue += receivedQty * parseFloat(poItem.unitPrice);
    }

    // Update PO status
    const allItemsReceived = purchaseOrder.items.every(item => 
      parseFloat(item.remainingQuantity) === 0
    );

    if (allItemsReceived) {
      purchaseOrder.status = 'Received';
      purchaseOrder.actualDeliveryDate = new Date();
    } else {
      purchaseOrder.status = 'Partially Received';
    }

    purchaseOrder.updated = new Date();
    await purchaseOrder.save({ session });

    // Create ledger entry for purchase
    const ledgerEntry = new LedgerEntry({
      partyType: 'Supplier',
      partyId: purchaseOrder.supplier,
      partyModel: 'Supplier',
      entryType: 'Purchase',
      debit: totalReceivedValue.toString(),
      credit: '0',
      balance: totalReceivedValue.toString(),
      refId: purchaseOrder._id,
      refModel: 'PurchaseOrder',
      description: `Purchase from PO ${purchaseOrder.poNumber}`,
      notes: notes,
      createdBy: userId,
    });

    await ledgerEntry.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      result: {
        purchaseOrder,
        inventoryRolls: newInventoryRolls,
        stockTxns: newStockTxns,
        ledgerEntry,
      },
      message: 'Purchase order received successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const closePurchaseOrder = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  const purchaseOrder = await PurchaseOrder.findById(id);
  if (!purchaseOrder) {
    throw new Error('Purchase order not found');
  }

  if (purchaseOrder.status !== 'Received') {
    throw new Error('Only received purchase orders can be closed');
  }

  purchaseOrder.status = 'Closed';
  purchaseOrder.updated = new Date();
  if (notes) {
    purchaseOrder.notes = notes;
  }

  await purchaseOrder.save();

  res.status(200).json({
    success: true,
    result: purchaseOrder,
    message: 'Purchase order closed successfully',
  });
});

module.exports = {
  create: createPurchaseOrder,
  read: readPurchaseOrder,
  update: updatePurchaseOrder,
  delete: deletePurchaseOrder,
  list: listPurchaseOrders,
  search: searchPurchaseOrders,
  filter: filterPurchaseOrders,
  summary: summaryPurchaseOrders,
  updateStatus: updatePurchaseOrderStatus,
  receive: receivePurchaseOrder,
  close: closePurchaseOrder,
};
