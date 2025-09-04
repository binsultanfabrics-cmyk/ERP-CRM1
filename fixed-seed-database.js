const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection string from backend .env file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://FitexDB:BsBfEaio5bo5UH01@cluster0.yytiy.mongodb.net/erp-crm';

// Import dummy data
const dummyData1 = require('./DUMMY_DATA.json');
const dummyData2 = require('./DUMMY_DATA_PART2.json');
const dummyData3 = require('./DUMMY_DATA_PART3.json');

// Additional dummy data for remaining collections
const additionalData = {
  posSettings: [
    {
      type: "general",
      shopName: "Fabric Paradise",
      taxRate: 15.0,
      currency: "PKR",
      receiptHeader: "Welcome to Fabric Paradise",
      receiptFooter: "Thank you for your business!",
      timezone: "Asia/Karachi",
      language: "en",
      cashierDiscountLimit: 10.0,
      managerPin: "1234",
      requireManagerApproval: {
        discountOver10: true,
        refunds: true,
        voids: true
      },
      sessionTimeout: 30,
      maxLoginAttempts: 3,
      receiptWidth: 80,
      autoPrintReceipt: true,
      printLogo: true,
      logoUrl: "/uploads/logo.png",
      printBarcode: true,
      printQRCode: true,
      paperSize: "A4",
      marginTop: 10,
      marginBottom: 10,
      enableAnalytics: true,
      dataRetentionDays: 365,
      autoGenerateReports: true,
      reportSchedule: "monthly",
      enableNotifications: true,
      lowStockAlert: true,
      lowStockThreshold: 10,
      salesTargetAlerts: true,
      dailySalesTarget: 50000.0,
      enableWhatsApp: false,
      whatsappApiKey: "",
      enableSMS: false,
      smsApiKey: "",
      enableEmail: true,
      emailSettings: {
        smtp: "smtp.gmail.com",
        port: 587,
        username: "admin@fabricparadise.com",
        password: "encrypted_password"
      },
      autoBackup: true,
      backupFrequency: "daily",
      backupRetention: 30,
      enableAuditLog: true,
      enableMultiCurrency: false,
      enableMultiLocation: false,
      enableCustomerLoyalty: true,
      loyaltyPointsRate: 1.0,
      createdBy: "507f1f77bcf86cd799439041",
      updatedBy: "507f1f77bcf86cd799439041",
      isActive: true,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  products: [
    {
      removed: false,
      enabled: true,
      code: "COT001",
      name: "Premium Cotton Fabric",
      fabricType: "Cotton",
      color: "White",
      size: "Standard",
      description: "High quality cotton fabric for clothing",
      images: ["/uploads/cotton1.jpg"],
      pricing: {
        minSalePrice: 120.0,
        maxSalePrice: 180.0,
        defaultUnit: "m",
        costPrice: 100.0
      },
      supplier: "507f1f77bcf86cd799439051",
      category: "Cotton",
      tags: ["cotton", "premium", "clothing"],
      barcode: "1234567890123",
      sku: "COT001-WH",
      createdBy: "507f1f77bcf86cd799439041",
      created: new Date(),
      updated: new Date()
    },
    {
      removed: false,
      enabled: true,
      code: "SLK001",
      name: "Luxury Silk Fabric",
      fabricType: "Silk",
      color: "Red",
      size: "Standard",
      description: "Premium silk fabric for formal wear",
      images: ["/uploads/silk1.jpg"],
      pricing: {
        minSalePrice: 200.0,
        maxSalePrice: 300.0,
        defaultUnit: "m",
        costPrice: 150.0
      },
      supplier: "507f1f77bcf86cd799439052",
      category: "Silk",
      tags: ["silk", "luxury", "formal"],
      barcode: "1234567890124",
      sku: "SLK001-RD",
      createdBy: "507f1f77bcf86cd799439041",
      created: new Date(),
      updated: new Date()
    }
  ],
  stockTxns: [
    {
      removed: false,
      enabled: true,
      type: "IN",
      product: "507f1f77bcf86cd799439021",
      roll: "507f1f77bcf86cd799439061",
      qty: 100.0,
      unit: "m",
      refType: "Purchase",
      refId: "507f1f77bcf86cd799439051",
      refModel: "Purchase",
      previousQty: 0.0,
      newQty: 100.0,
      unitCost: 120.0,
      totalValue: 12000.0,
      notes: "Initial stock purchase",
      createdBy: "507f1f77bcf86cd799439041",
      created: new Date(),
      updated: new Date()
    }
  ],
  suppliers: [
    {
      removed: false,
      enabled: true,
      code: "SUP001",
      name: "Cotton Mills Ltd",
      companyName: "Cotton Mills Limited",
      contactPerson: "Ahmed Khan",
      phone: "+92-300-1111111",
      email: "ahmed@cottonmills.com",
      address: "Industrial Area, Lahore",
      city: "Lahore",
      country: "Pakistan",
      taxNumber: "TAX001",
      creditLimit: 100000.0,
      currentBalance: 0.0,
      paymentTerms: 30,
      notes: "Reliable cotton supplier",
      createdBy: "507f1f77bcf86cd799439041",
      created: new Date(),
      updated: new Date()
    }
  ],
  units: [
    {
      removed: false,
      enabled: true,
      code: "m",
      name: "Meter",
      precision: 2,
      ratioToBase: 1.0,
      isBaseUnit: true,
      created: new Date(),
      updated: new Date()
    },
    {
      removed: false,
      enabled: true,
      code: "yd",
      name: "Yard",
      precision: 2,
      ratioToBase: 0.9144,
      isBaseUnit: false,
      created: new Date(),
      updated: new Date()
    }
  ],
  settings: [
    {
      removed: false,
      enabled: true,
      settingCategory: "general",
      settingKey: "company_name",
      settingValue: "Fabric Paradise",
      valueType: "string",
      isPrivate: false,
      isCoreSetting: true
    },
    {
      removed: false,
      enabled: true,
      settingCategory: "general",
      settingKey: "company_address",
      settingValue: "123 Main Street, Lahore, Pakistan",
      valueType: "string",
      isPrivate: false,
      isCoreSetting: true
    }
  ],
  uploads: [
    {
      removed: false,
      enabled: true,
      modelName: "Product",
      fieldId: "507f1f77bcf86cd799439021",
      fileName: "cotton_fabric.jpg",
      fileType: "image/jpeg",
      isPublic: true,
      userID: "507f1f77bcf86cd799439041",
      isSecure: false,
      path: "/uploads/products/cotton_fabric.jpg",
      created: new Date()
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Combine all data
    const allData = {
      ...dummyData1,
      ...dummyData2,
      ...dummyData3,
      ...additionalData
    };

    // Fix posSales data by adding unique saleNumber
    if (allData.posSales) {
      allData.posSales = allData.posSales.map((sale, index) => ({
        ...sale,
        saleNumber: `SALE-${String(index + 1).padStart(4, '0')}` // Add unique sale numbers
      }));
    }

    // Collection mapping
    const collections = {
      bargainLogs: 'bargainlogs',
      clients: 'clients',
      employees: 'employees',
      inventoryRolls: 'inventoryrolls',
      invoices: 'invoices',
      ledgerEntries: 'ledgerentries',
      payrolls: 'payrolls',
      posSales: 'possales',
      posSettings: 'possettings',
      products: 'products',
      stockTxns: 'stocktxns',
      suppliers: 'suppliers',
      units: 'units',
      settings: 'settings',
      uploads: 'uploads'
    };

    // Seed each collection
    for (const [dataKey, collectionName] of Object.entries(collections)) {
      if (allData[dataKey]) {
        console.log(`📝 Seeding ${collectionName} with ${allData[dataKey].length} documents...`);
        
        // Clear existing data
        await db.collection(collectionName).deleteMany({});
        console.log(`🗑️  Cleared existing data in ${collectionName}`);
        
        // Insert new data
        const result = await db.collection(collectionName).insertMany(allData[dataKey]);
        console.log(`✅ Inserted ${result.insertedCount} documents into ${collectionName}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 Seeding Summary:');
    for (const [dataKey, collectionName] of Object.entries(collections)) {
      if (allData[dataKey]) {
        const count = await db.collection(collectionName).countDocuments();
        console.log(`   ${collectionName}: ${count} documents`);
      }
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding function
seedDatabase();
