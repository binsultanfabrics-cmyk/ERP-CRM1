const mongoose = require('mongoose');

const listAllSettings = async () => {
  try {
    // Check if database is connected and model is available
    if (!mongoose.connection.readyState || !mongoose.models.Setting) {
      return [];
    }

    //  Query the database for a list of all results
    const Model = mongoose.model('Setting');
    const result = await Model.find({
      removed: false,
    }).exec();

    if (result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

module.exports = listAllSettings;
