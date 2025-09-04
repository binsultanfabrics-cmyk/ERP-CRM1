const { catchErrors } = require('@/handlers/errorHandlers');
const { initializeERPFeatures, resetERPFeatures } = require('@/setup/initializeERPFeatures');

const setupERPFeatures = catchErrors(async (req, res) => {
  const result = await initializeERPFeatures();
  
  if (result.success) {
    res.status(200).json({
      success: true,
      result: result.data,
      message: result.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: result.message,
      error: result.error,
    });
  }
});

const resetERPFeaturesEndpoint = catchErrors(async (req, res) => {
  const result = await resetERPFeatures();
  
  if (result.success) {
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: result.message,
      error: result.error,
    });
  }
});

module.exports = {
  setupERPFeatures,
  resetERPFeatures: resetERPFeaturesEndpoint,
};
