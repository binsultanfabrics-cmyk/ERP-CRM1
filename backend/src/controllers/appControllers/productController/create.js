const mongoose = require('mongoose');

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

    // Create product
    const product = await Model.create({
      ...req.body,
      createdBy: req.admin._id,
    });

    return res.status(200).json({
      success: true,
      result: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = create;
