const mongoose = require('mongoose');

const remove = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Model.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Product not found',
      });
    }
    return res.status(200).json({
      success: true,
      result: deletedProduct,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = remove;
