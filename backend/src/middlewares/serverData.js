const mongoose = require('mongoose');

exports.getData = ({ model }) => {
  // Check if database is connected and model is available
  if (!mongoose.connection.readyState || !mongoose.models[model]) {
    return Promise.resolve([]);
  }
  
  const Model = mongoose.model(model);
  const result = Model.find({ removed: false, enabled: true });
  return result;
};

exports.getOne = ({ model, id }) => {
  // Check if database is connected and model is available
  if (!mongoose.connection.readyState || !mongoose.models[model]) {
    return Promise.resolve(null);
  }
  
  const Model = mongoose.model(model);
  const result = Model.findOne({ _id: id, removed: false });
  return result;
};
