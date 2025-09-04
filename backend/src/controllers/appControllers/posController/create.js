const mongoose = require('mongoose');
const moment = require('moment');

const create = async (Model, req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Generate sale number
    const today = moment().format('YYYYMMDD');
    const count = await Model.countDocuments({
      saleNumber: { $regex: `^SALE-${today}` },
    });
    const saleNumber = `SALE-${today}-${String(count + 1).padStart(4, '0')}`;

    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    // Process items and update inventory
    for (const item of req.body.items) {
      // Validate roll exists and has sufficient stock
      const roll = await mongoose.model('InventoryRoll').findById(item.roll);
      if (!roll) {
        throw new Error(`Roll ${item.roll} not found`);
      }

      if (parseFloat(roll.remainingLength) < parseFloat(item.qty)) {
        throw new Error(`Insufficient stock in roll ${roll.rollNumber}`);
      }

      // Calculate item totals
      const gross = parseFloat(item.qty) * parseFloat(item.unitPrice);
      const discount = parseFloat(item.discount || 0);
      const net = gross - discount;
      const tax = net * 0.05; // 5% tax

      item.gross = gross;
      item.net = net;
      item.tax = tax;
      item.total = net + tax;

      subtotal += gross;
      totalDiscount += discount;
      totalTax += tax;

      // Update inventory roll
      const newRemainingLength = parseFloat(roll.remainingLength) - parseFloat(item.qty);
      await mongoose.model('InventoryRoll').findByIdAndUpdate(
        roll._id,
        { 
          remainingLength: newRemainingLength,
          status: newRemainingLength <= 0 ? 'Out of Stock' : 
                  newRemainingLength <= 5 ? 'Low Stock' : 'Available'
        },
        { session }
      );

      // Create stock transaction
      await mongoose.model('StockTxn').create([{
        type: 'OUT',
        product: item.product,
        roll: item.roll,
        qty: item.qty,
        unit: item.unit,
        refType: 'Sale',
        refId: null, // Will be updated after sale creation
        refModel: 'PosSale',
        previousQty: roll.remainingLength,
        newQty: newRemainingLength,
        unitCost: roll.costPerUnit,
        totalValue: parseFloat(item.qty) * parseFloat(roll.costPerUnit),
        notes: `Sale: ${saleNumber}`,
        createdBy: req.admin._id,
      }], { session });
    }

    const grandTotal = subtotal - totalDiscount + totalTax;

    // Calculate payments
    let totalPaid = 0;
    for (const payment of req.body.payments) {
      totalPaid += parseFloat(payment.amount);
    }

    const balance = grandTotal - totalPaid;

    // Create sale record
    const saleData = {
      ...req.body,
      saleNumber,
      subtotal,
      totalDiscount,
      totalTax,
      grandTotal,
      totalPaid,
      balance,
      createdBy: req.admin._id,
    };

    const sale = await Model.create([saleData], { session });

    // Update stock transactions with sale reference
    await mongoose.model('StockTxn').updateMany(
      { refModel: 'PosSale', refId: null },
      { refId: sale[0]._id },
      { session }
    );

    // Create ledger entries
    if (req.body.customer) {
      // Customer ledger entry
      const customerBalance = await getPartyBalance('Customer', req.body.customer);
      const newBalance = customerBalance + grandTotal;
      
      await mongoose.model('LedgerEntry').create([{
        partyType: 'Customer',
        partyId: req.body.customer,
        partyModel: 'Client',
        entryType: 'Sale',
        debit: grandTotal,
        credit: 0,
        balance: newBalance,
        refId: sale[0]._id,
        refModel: 'PosSale',
        description: `Sale: ${saleNumber}`,
        createdBy: req.admin._id,
      }], { session });
    }

    // Employee commission ledger entry
    if (req.body.staff) {
      const employee = await mongoose.model('Employee').findById(req.body.staff);
      if (employee && employee.commissionRate > 0) {
        const commission = grandTotal * (parseFloat(employee.commissionRate) / 100);
        const employeeBalance = await getPartyBalance('Employee', req.body.staff);
        const newBalance = employeeBalance + commission;

        await mongoose.model('LedgerEntry').create([{
          partyType: 'Employee',
          partyId: req.body.staff,
          partyModel: 'Employee',
          entryType: 'Commission',
          debit: commission,
          credit: 0,
          balance: newBalance,
          refId: sale[0]._id,
          refModel: 'PosSale',
          description: `Commission from sale: ${saleNumber}`,
          createdBy: req.admin._id,
        }], { session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      result: sale[0],
      message: 'Sale created successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

async function getPartyBalance(partyType, partyId) {
  const lastEntry = await mongoose.model('LedgerEntry')
    .findOne({ partyType, partyId })
    .sort({ created: -1 });
  
  return lastEntry ? parseFloat(lastEntry.balance) : 0;
}

module.exports = create;
