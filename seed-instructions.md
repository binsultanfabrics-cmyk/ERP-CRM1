# 🌱 Database Seeding Instructions

## 📋 Prerequisites

1. **MongoDB Running**: Ensure MongoDB is running on your system
2. **Node.js**: Make sure Node.js is installed
3. **Dependencies**: Install required packages

## 🚀 Quick Start

### Option 1: Using the Complete Seeding Script (Recommended)

```bash
# Install dependencies if not already installed
npm install mongoose

# Run the complete seeding script
node complete-seed-database.js
```

### Option 2: Using the Basic Seeding Script

```bash
# Run the basic seeding script (only includes data from JSON files)
node seed-database.js
```

## ⚙️ Configuration

### MongoDB Connection

Update the MongoDB connection string in the seeding script:

```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/erp-crm';
```

**Common connection strings:**
- Local MongoDB: `mongodb://localhost:27017/erp-crm`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/erp-crm`
- Docker MongoDB: `mongodb://localhost:27017/erp-crm`

### Environment Variables

You can set the MongoDB URI as an environment variable:

```bash
# Windows
set MONGODB_URI=mongodb://localhost:27017/erp-crm
node complete-seed-database.js

# Linux/Mac
export MONGODB_URI=mongodb://localhost:27017/erp-crm
node complete-seed-database.js
```

## 📊 What Gets Seeded

### Collections with 10 entries each:
- **bargainLogs** - Price negotiation tracking
- **clients** - Customer information
- **employees** - Staff management
- **inventoryRolls** - Fabric roll inventory
- **invoices** - Invoice management
- **ledgerEntries** - Financial ledger
- **payrolls** - Employee payroll
- **posSales** - Point of sale transactions

### Additional Collections:
- **posSettings** - POS system configuration (1 entry)
- **products** - Product catalog (2 entries)
- **stockTxns** - Stock transactions (1 entry)
- **suppliers** - Supplier information (1 entry)
- **units** - Measurement units (2 entries)
- **settings** - System settings (2 entries)
- **uploads** - File management (1 entry)

## 🔄 Re-seeding

The scripts will:
1. **Clear existing data** from all collections
2. **Insert fresh data** from the dummy data files
3. **Display a summary** of inserted documents

## 🐛 Troubleshooting

### Common Issues:

1. **Connection Error**:
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Make sure MongoDB is running

2. **Authentication Error**:
   ```
   Error: Authentication failed
   ```
   **Solution**: Check your MongoDB credentials and connection string

3. **Database Not Found**:
   ```
   Error: database not found
   ```
   **Solution**: The database will be created automatically when data is inserted

4. **File Not Found**:
   ```
   Error: Cannot find module './DUMMY_DATA.json'
   ```
   **Solution**: Make sure all JSON files are in the same directory as the script

## 📝 Customization

### Adding More Data

To add more dummy data:

1. **Edit the JSON files** to add more entries
2. **Modify the additionalData object** in `complete-seed-database.js`
3. **Run the seeding script again**

### Selective Seeding

To seed only specific collections, modify the script to comment out unwanted collections:

```javascript
const collections = {
  // bargainLogs: 'bargainlogs',  // Comment out to skip
  clients: 'clients',
  // employees: 'employees',      // Comment out to skip
  // ... other collections
};
```

## ✅ Verification

After seeding, verify the data by:

1. **Check MongoDB Compass** or your preferred MongoDB client
2. **Run a count query**:
   ```javascript
   db.clients.countDocuments()
   db.employees.countDocuments()
   // ... etc
   ```
3. **Check the console output** for the seeding summary

## 🎯 Next Steps

After successful seeding:

1. **Start your application** and verify the dashboard shows data
2. **Test the POS system** with the seeded products and customers
3. **Generate reports** to see the dummy data in action
4. **Customize the data** as needed for your specific use case

---

**Note**: The seeding scripts will clear existing data. Make sure to backup your database if you have important data that you want to keep.
