const { convertForModel } = require('@/utils/decimalConverter');

const create = async (Model, req, res) => {
  try {
    // Creating a new document in the collection
    req.body.removed = false;
    
    // Convert numeric fields to Decimal128 for the specific model
    const modelName = Model.modelName;
    const convertedData = convertForModel(modelName, req.body);
    
    const result = await new Model(convertedData).save();

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Created the document in Model ',
    });
  } catch (error) {
    console.error('Create error:', error);
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = create;
