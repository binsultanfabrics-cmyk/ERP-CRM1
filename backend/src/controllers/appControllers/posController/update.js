const mongoose = require('mongoose');

const update = async (Model, req, res) => {
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

    // Only allow updates for pending sales
    if (existingSale.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Only pending sales can be updated',
      });
    }

    // Update sale
    const updatedSale = await Model.findByIdAndUpdate(
      id,
      { ...req.body, updated: Date.now() },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      result: updatedSale,
      message: 'Sale updated successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = update;
