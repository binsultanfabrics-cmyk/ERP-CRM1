const mongoose = require('mongoose');

const readBySettingKey = async ({ settingKey }) => {
  try {
    // Check if database is connected and model is available
    if (!mongoose.connection.readyState || !mongoose.models.Setting) {
      return null;
    }

    // Find document by id
    if (!settingKey) {
      return null;
    }

    const Model = mongoose.model('Setting');
    const result = await Model.findOne({ settingKey });
    // If no results found, return document not found
    if (!result) {
      return null;
    } else {
      // Return success resposne
      return result;
    }
  } catch {
    return null;
  }
};

module.exports = readBySettingKey;
