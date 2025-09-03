const mongoose = require('mongoose');

const remove = async (Model, req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    
    // Find existing sale
    const existingSale = await Model.findById(id);
    if (!existingSale) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Sale not found',
      });
    }

    // Only allow deletion for pending sales
    if (existingSale.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Only pending sales can be deleted',
      });
    }

    // Restore inventory
    for (const item of existingSale.items) {
      const roll = await mongoose.model('InventoryRoll').findById(item.roll);
      if (roll) {
        const newRemainingLength = parseFloat(roll.remainingLength) + parseFloat(item.qty);
        await mongoose.model('InventoryRoll').findByIdAndUpdate(
          roll._id,
          { 
            remainingLength: newRemainingLength,
            status: newRemainingLength <= 0 ? 'Out of Stock' : 
                    newRemainingLength <= 5 ? 'Low Stock' : 'Available'
          },
          { session }
        );
      }
    }

    // Remove stock transactions
    await mongoose.model('StockTxn').deleteMany(
      { refId: existingSale._id, refModel: 'PosSale' },
      { session }
    );

    // Remove ledger entries
    await mongoose.model('LedgerEntry').deleteMany(
      { refId: existingSale._id, refModel: 'PosSale' },
      { session }
    );

    // Remove bargain logs
    await mongoose.model('BargainLog').deleteMany(
      { sale: existingSale._id },
      { session }
    );

    // Delete the sale
    await Model.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Sale deleted successfully',
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

module.exports = remove;
