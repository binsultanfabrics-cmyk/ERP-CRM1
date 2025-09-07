const mongoose = require('mongoose');

const { convertForModel } = require('@/utils/decimalConverter');

const update = async (Model, req, res) => {
  try {
    const { id } = req.params;
    
    // Convert numeric fields to Decimal128
    const convertedData = convertForModel('Product', req.body);
    
    const updatedProduct = await Model.findByIdAndUpdate(
      id,
      { ...convertedData, updated: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      success: true,
      result: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Product update error:', error);
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = update;
