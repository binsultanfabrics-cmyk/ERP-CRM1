const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import all the dummy data files
const dummyData1 = require('./DUMMY_DATA.json');
const dummyData2 = require('./DUMMY_DATA_PART2.json');
const dummyData3 = require('./DUMMY_DATA_PART3.json');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-crm';

// Collection names mapping
const collections = {
  bargainLogs: 'bargainlogs',
  clients: 'clients',
  employees: 'employees',
  inventoryRolls: 'inventoryrolls',
  invoices: 'invoices',
  ledgerEntries: 'ledgerentries',
  payrolls: 'payrolls',
  posSales: 'possales'
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get database instance
    const db = mongoose.connection.db;

    // Combine all dummy data
    const allData = {
      ...dummyData1,
      ...dummyData2,
      ...dummyData3
    };

    // Seed each collection
    for (const [dataKey, collectionName] of Object.entries(collections)) {
      if (allData[dataKey]) {
        console.log(`📝 Seeding ${collectionName} with ${allData[dataKey].length} documents...`);
        
        // Clear existing data (optional - remove this if you want to keep existing data)
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
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding function
seedDatabase();
