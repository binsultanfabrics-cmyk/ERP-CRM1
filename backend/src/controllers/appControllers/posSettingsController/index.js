const PosSettings = require('../../../models/appModels/PosSettings');

const create = async (req, res) => {
  try {
    const { type, ...settingsData } = req.body;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Settings type is required'
      });
    }

    // Create new version of settings
    const newSettings = await PosSettings.createNewVersion(
      type,
      settingsData,
      req.admin._id
    );

    res.status(200).json({
      success: true,
      result: newSettings,
      message: 'POS settings created successfully'
    });

  } catch (error) {
    console.error('POS Settings Create Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to create POS settings',
      error: error.message
    });
  }
};

const list = async (req, res) => {
  try {
    const { type } = req.query;
    
    let settings;
    if (type) {
      settings = await PosSettings.getSettingsByType(type);
    } else {
      settings = await PosSettings.getAllActiveSettings();
    }

    res.status(200).json({
      success: true,
      result: settings,
      message: 'POS settings retrieved successfully'
    });

  } catch (error) {
    console.error('POS Settings List Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve POS settings',
      error: error.message
    });
  }
};

const read = async (req, res) => {
  try {
    const { id } = req.params;
    
    const settings = await PosSettings.findById(id);
    if (!settings) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'POS settings not found'
      });
    }

    res.status(200).json({
      success: true,
      result: settings,
      message: 'POS settings retrieved successfully'
    });

  } catch (error) {
    console.error('POS Settings Read Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve POS settings',
      error: error.message
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const settings = await PosSettings.findById(id);
    if (!settings) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'POS settings not found'
      });
    }

    // Update settings
    await settings.updateSettings(updateData, req.admin._id);

    res.status(200).json({
      success: true,
      result: settings,
      message: 'POS settings updated successfully'
    });

  } catch (error) {
    console.error('POS Settings Update Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to update POS settings',
      error: error.message
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const settings = await PosSettings.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!settings) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'POS settings not found'
      });
    }

    res.status(200).json({
      success: true,
      result: settings,
      message: 'POS settings removed successfully'
    });

  } catch (error) {
    console.error('POS Settings Remove Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to remove POS settings',
      error: error.message
    });
  }
};

const getDefaultSettings = async (req, res) => {
  try {
    const defaultSettings = {
      general: {
        shopName: 'Bin Sultan Cloth Shop',
        taxRate: 15.0,
        currency: 'Rs',
        receiptHeader: 'Thank you for shopping with us!',
        receiptFooter: 'Please visit again!',
        timezone: 'Asia/Karachi',
        language: 'en'
      },
      security: {
        cashierDiscountLimit: 10.0,
        managerPin: '1234',
        requireManagerApproval: {
          highDiscounts: true,
          creditSales: true,
          returns: true,
          voidSales: true,
          priceOverrides: true
        },
        sessionTimeout: 30,
        maxLoginAttempts: 5
      },
      printer: {
        receiptWidth: 80,
        autoPrintReceipt: true,
        printLogo: false,
        printBarcode: true,
        printQRCode: true,
        paperSize: 'Receipt',
        marginTop: 10,
        marginBottom: 10
      },
      analytics: {
        enableAnalytics: true,
        dataRetentionDays: 365,
        autoGenerateReports: false,
        reportSchedule: 'never'
      },
      notifications: {
        enableNotifications: true,
        lowStockAlert: true,
        lowStockThreshold: 5,
        salesTargetAlerts: false,
        dailySalesTarget: 0
      },
      integrations: {
        enableWhatsApp: true,
        enableSMS: false,
        enableEmail: false
      },
      backup: {
        autoBackup: false,
        backupFrequency: 'weekly',
        backupRetention: 30
      },
      advanced: {
        enableAuditLog: true,
        enableMultiCurrency: false,
        enableMultiLocation: false,
        enableCustomerLoyalty: false,
        loyaltyPointsRate: 1
      }
    };

    res.status(200).json({
      success: true,
      result: defaultSettings,
      message: 'Default POS settings retrieved successfully'
    });

  } catch (error) {
    console.error('Default Settings Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to retrieve default settings',
      error: error.message
    });
  }
};

const resetToDefaults = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Settings type is required'
      });
    }

    // Get default settings for the type
    const defaultSettings = await getDefaultSettingsForType(type);
    
    // Create new version with default values
    const newSettings = await PosSettings.createNewVersion(
      type,
      defaultSettings,
      req.admin._id
    );

    res.status(200).json({
      success: true,
      result: newSettings,
      message: 'POS settings reset to defaults successfully'
    });

  } catch (error) {
    console.error('Reset Settings Error:', error);
    res.status(500).json({
      success: false,
      result: null,
      message: 'Failed to reset POS settings',
      error: error.message
    });
  }
};

const getDefaultSettingsForType = (type) => {
  const defaults = {
    general: {
      shopName: 'Bin Sultan Cloth Shop',
      taxRate: 15.0,
      currency: 'Rs',
      receiptHeader: 'Thank you for shopping with us!',
      receiptFooter: 'Please visit again!',
      timezone: 'Asia/Karachi',
      language: 'en'
    },
    security: {
      cashierDiscountLimit: 10.0,
      managerPin: '1234',
      requireManagerApproval: {
        highDiscounts: true,
        creditSales: true,
        returns: true,
        voidSales: true,
        priceOverrides: true
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5
    },
    printer: {
      receiptWidth: 80,
      autoPrintReceipt: true,
      printLogo: false,
      printBarcode: true,
      printQRCode: true,
      paperSize: 'Receipt',
      marginTop: 10,
      marginBottom: 10
    },
    analytics: {
      enableAnalytics: true,
      dataRetentionDays: 365,
      autoGenerateReports: false,
      reportSchedule: 'never'
    }
  };

  return defaults[type] || {};
};

module.exports = {
  create,
  list,
  read,
  update,
  remove,
  getDefaultSettings,
  resetToDefaults
};
