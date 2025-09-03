const mongoose = require('mongoose');

const increaseBySettingKey = async ({ settingKey }) => {
  try {
    // Check if database is connected and model is available
    if (!mongoose.connection.readyState || !mongoose.models.Setting) {
      return null;
    }

    if (!settingKey) {
      return null;
    }

    const Model = mongoose.model('Setting');
    const result = await Model.findOneAndUpdate(
      { settingKey },
      {
        $inc: { settingValue: 1 },
      },
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();

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

module.exports = increaseBySettingKey;
