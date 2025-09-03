const mongoose = require('mongoose');
const { Schema } = mongoose;

const posSettingsSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['general', 'security', 'printer', 'analytics'],
      index: true
    },
    
    // General Settings
    shopName: {
      type: String,
      trim: true,
      default: 'Bin Sultan Cloth Shop'
    },
    taxRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 15.0
    },
    currency: {
      type: String,
      default: 'Rs',
      enum: ['Rs', '$', '€', '£']
    },
    receiptHeader: {
      type: String,
      trim: true,
      default: 'Thank you for shopping with us!'
    },
    receiptFooter: {
      type: String,
      trim: true,
      default: 'Please visit again!'
    },
    timezone: {
      type: String,
      default: 'Asia/Karachi'
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'ur', 'ar']
    },
    
    // Security Settings
    cashierDiscountLimit: {
      type: Number,
      min: 0,
      max: 100,
      default: 10.0
    },
    managerPin: {
      type: String,
      trim: true,
      default: '1234'
    },
    requireManagerApproval: {
      highDiscounts: {
        type: Boolean,
        default: true
      },
      creditSales: {
        type: Boolean,
        default: true
      },
      returns: {
        type: Boolean,
        default: true
      },
      voidSales: {
        type: Boolean,
        default: true
      },
      priceOverrides: {
        type: Boolean,
        default: true
      }
    },
    sessionTimeout: {
      type: Number,
      min: 5,
      max: 480,
      default: 30 // minutes
    },
    maxLoginAttempts: {
      type: Number,
      min: 3,
      max: 10,
      default: 5
    },
    
    // Printer Settings
    receiptWidth: {
      type: Number,
      default: 80,
      enum: [58, 80, 112]
    },
    autoPrintReceipt: {
      type: Boolean,
      default: true
    },
    printLogo: {
      type: Boolean,
      default: false
    },
    logoUrl: {
      type: String,
      trim: true
    },
    printBarcode: {
      type: Boolean,
      default: true
    },
    printQRCode: {
      type: Boolean,
      default: true
    },
    paperSize: {
      type: String,
      default: 'A4',
      enum: ['A4', 'A5', 'Letter', 'Receipt']
    },
    marginTop: {
      type: Number,
      default: 10,
      min: 0,
      max: 50
    },
    marginBottom: {
      type: Number,
      default: 10,
      min: 0,
      max: 50
    },
    
    // Analytics Settings
    enableAnalytics: {
      type: Boolean,
      default: true
    },
    dataRetentionDays: {
      type: Number,
      default: 365,
      min: 30,
      max: 2555
    },
    autoGenerateReports: {
      type: Boolean,
      default: false
    },
    reportSchedule: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'never'],
      default: 'never'
    },
    
    // Notification Settings
    enableNotifications: {
      type: Boolean,
      default: true
    },
    lowStockAlert: {
      type: Boolean,
      default: true
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 1
    },
    salesTargetAlerts: {
      type: Boolean,
      default: false
    },
    dailySalesTarget: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Integration Settings
    enableWhatsApp: {
      type: Boolean,
      default: true
    },
    whatsappApiKey: {
      type: String,
      trim: true
    },
    enableSMS: {
      type: Boolean,
      default: false
    },
    smsApiKey: {
      type: String,
      trim: true
    },
    enableEmail: {
      type: Boolean,
      default: false
    },
    emailSettings: {
      smtpHost: String,
      smtpPort: Number,
      smtpUser: String,
      smtpPassword: String,
      fromEmail: String,
      fromName: String
    },
    
    // Backup Settings
    autoBackup: {
      type: Boolean,
      default: false
    },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    backupRetention: {
      type: Number,
      default: 30,
      min: 1,
      max: 365
    },
    
    // Advanced Settings
    enableAuditLog: {
      type: Boolean,
      default: true
    },
    enableMultiCurrency: {
      type: Boolean,
      default: false
    },
    enableMultiLocation: {
      type: Boolean,
      default: false
    },
    enableCustomerLoyalty: {
      type: Boolean,
      default: false
    },
    loyaltyPointsRate: {
      type: Number,
      default: 1,
      min: 0
    },
    
    // Metadata
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    version: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
posSettingsSchema.index({ type: 1, isActive: 1 });
posSettingsSchema.index({ createdBy: 1 });
posSettingsSchema.index({ updatedAt: -1 });

// Static method to get settings by type
posSettingsSchema.statics.getSettingsByType = async function(type) {
  return await this.findOne({ type, isActive: true }).sort({ version: -1 });
};

// Static method to get all active settings
posSettingsSchema.statics.getAllActiveSettings = async function() {
  const settings = await this.find({ isActive: true }).sort({ type: 1, version: -1 });
  
  // Group by type and get the latest version of each
  const groupedSettings = {};
  settings.forEach(setting => {
    if (!groupedSettings[setting.type] || setting.version > groupedSettings[setting.type].version) {
      groupedSettings[setting.type] = setting;
    }
  });
  
  return groupedSettings;
};

// Static method to create new version of settings
posSettingsSchema.statics.createNewVersion = async function(type, data, adminId) {
  const currentSettings = await this.getSettingsByType(type);
  const newVersion = currentSettings ? currentSettings.version + 1 : 1;
  
  return await this.create({
    ...data,
    type,
    version: newVersion,
    createdBy: adminId
  });
};

// Instance method to update settings
posSettingsSchema.methods.updateSettings = async function(updateData, adminId) {
  Object.assign(this, updateData);
  this.updatedBy = adminId;
  this.updatedAt = new Date();
  return await this.save();
};

// Pre-save middleware to validate settings
posSettingsSchema.pre('save', function(next) {
  // Validate tax rate
  if (this.taxRate < 0 || this.taxRate > 100) {
    return next(new Error('Tax rate must be between 0 and 100'));
  }
  
  // Validate discount limit
  if (this.cashierDiscountLimit < 0 || this.cashierDiscountLimit > 100) {
    return next(new Error('Cashier discount limit must be between 0 and 100'));
  }
  
  // Validate session timeout
  if (this.sessionTimeout < 5 || this.sessionTimeout > 480) {
    return next(new Error('Session timeout must be between 5 and 480 minutes'));
  }
  
  next();
});

module.exports = mongoose.model('PosSettings', posSettingsSchema);
