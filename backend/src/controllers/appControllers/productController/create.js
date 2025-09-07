const mongoose = require('mongoose');

const { convertForModel } = require('@/utils/decimalConverter');

const create = async (Model, req, res) => {
  try {
    // Generate product code if not provided
    if (!req.body.code) {
      const count = await Model.countDocuments();
      req.body.code = `PROD-${String(count + 1).padStart(4, '0')}`;
    }

    // Validate supplier exists
    if (req.body.supplier) {
      const supplier = await mongoose.model('Supplier').findById(req.body.supplier);
      if (!supplier) {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Supplier not found',
        });
      }
    }

    // Convert numeric fields to Decimal128
    const convertedData = convertForModel('Product', req.body);

    // Create product
    const product = await Model.create({
      ...convertedData,
      createdBy: req.admin._id,
    });

    return res.status(200).json({
      success: true,
      result: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Product create error:', error);
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = create;
