const mongoose = require('mongoose');

const me = async (req, res, { userModel }) => {
  try {
    const Model = mongoose.model(userModel);
    
    // The user is already validated by isValidAuthToken middleware
    // and is available in req.admin
    const user = await Model.findById(req.admin._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      result: user,
      message: 'User profile retrieved successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = me;

