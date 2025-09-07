const { convertForModel } = require('@/utils/decimalConverter');

const update = async (Model, req, res) => {
  try {
    // Find document by id and updates with the required fields
    req.body.removed = false;
    
    // Convert numeric fields to Decimal128 for the specific model
    const modelName = Model.modelName;
    const convertedData = convertForModel(modelName, req.body);
    
    const result = await Model.findOneAndUpdate(
      {
        _id: req.params.id,
        removed: false,
      },
      convertedData,
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();
    
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found ',
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'we update this document ',
      });
    }
  } catch (error) {
    console.error('Update error:', error);
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = update;
