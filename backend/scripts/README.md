# Database Seeding Scripts

This directory contains scripts to seed the Bin Sultan ERP-CRM database with realistic Pakistani cloth shop data.

## Available Scripts

### 1. Full Seed Script (`seedData.js`)
Comprehensive seeding with large dataset for production-like testing.

**Features:**
- 10 suppliers from major Pakistani textile companies
- 18 employees with different roles
- 15 different fabric products
- 200+ inventory rolls
- 30 customers
- 200+ POS sales transactions
- 50 invoices
- 30 purchase orders
- Complete payroll records
- Ledger entries for all parties

**Usage:**
```bash
cd backend
npm run seed
```

### 2. Quick Seed Script (`quickSeed.js`)
Lightweight seeding for development and testing.

**Features:**
- 5 suppliers
- 5 employees
- 5 fabric products
- 20+ inventory rolls
- 10 customers
- 50 POS sales
- 20 invoices
- 1 location

**Usage:**
```bash
cd backend
npm run seed:quick
```

## Prerequisites

1. **MongoDB Connection**: Ensure your MongoDB is running and accessible
2. **Environment Variables**: Make sure your `.env` file has the correct `DATABASE` connection string
3. **Dependencies**: All required npm packages should be installed

## Database Connection

The scripts will connect to MongoDB using the `DATABASE` environment variable from your `.env` file. If not set, it defaults to `mongodb://localhost:27017/erp-crm`.

## Pakistani Cloth Shop Data

The seeding scripts create realistic data for a typical Pakistani cloth shop:

### Suppliers
- Al-Karam Textiles (Karachi)
- Gul Ahmed (Karachi)
- Nishat Mills (Lahore)
- Chenab Limited (Faisalabad)
- Sapphire Textiles (Lahore)
- And more...

### Fabric Types
- Cotton (Lawn, Khadi, Voile, Poplin, Muslin)
- Silk (Chiffon, Organza, Satin)
- Wool (Suiting, Tweed)
- Polyester (Georgette, Crepe)
- Linen, Denim, Velvet

### Colors
Traditional and modern colors including White, Black, Red, Blue, Green, Yellow, Pink, Purple, Maroon, Navy, Sky Blue, Gold, Silver, and more.

### Cities
Major Pakistani cities including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and more.

### Employee Roles
- Manager
- Cashier
- Salesperson
- Helper
- Admin

### Payment Methods
- Cash
- Credit Card
- Bank Transfer
- Mobile Payment
- Credit

## Data Relationships

The scripts ensure proper relationships between entities:

1. **Products** → **Suppliers** (each product has a supplier)
2. **Inventory Rolls** → **Products** + **Suppliers** + **Locations**
3. **POS Sales** → **Customers** + **Employees** + **Products** + **Inventory Rolls**
4. **Invoices** → **Customers** + **Admin**
5. **Purchase Orders** → **Suppliers** + **Products** + **Admin**
6. **Payroll** → **Employees** + **Admin**
7. **Ledger Entries** → **Customers/Suppliers/Employees**

## Login Credentials

After seeding, you can login with:
- **Email**: admin@binsultan.com
- **Password**: admin123 (if using default authentication)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   ❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Ensure MongoDB is running on your system

2. **Permission Denied**
   ```
   ❌ Error seeding admin and roles: E11000 duplicate key error
   ```
   **Solution**: The script automatically clears existing data, but if you get this error, manually clear the database first

3. **Environment Variables**
   ```
   ❌ MongoDB connection error: Authentication failed
   ```
   **Solution**: Check your `.env` file for correct `DATABASE` connection string

### Manual Database Clear

If you need to manually clear the database:

```bash
# Connect to MongoDB
mongo

# Switch to your database
use erp-crm

# Clear all collections
db.admins.deleteMany({})
db.roles.deleteMany({})
db.permissions.deleteMany({})
db.clients.deleteMany({})
db.suppliers.deleteMany({})
db.employees.deleteMany({})
db.products.deleteMany({})
db.locations.deleteMany({})
db.inventoryrolls.deleteMany({})
db.possales.deleteMany({})
db.invoices.deleteMany({})
db.purchaseorders.deleteMany({})
db.payrolls.deleteMany({})
db.ledgerentries.deleteMany({})
```

## Customization

You can modify the seeding scripts to:

1. **Add more data**: Increase the number of records in the loops
2. **Change data types**: Modify the fabric types, colors, or cities arrays
3. **Adjust pricing**: Change the price ranges in the product creation
4. **Add new fields**: Include additional fields in the data objects

## Production Considerations

⚠️ **Warning**: These scripts are designed for development and testing. For production:

1. Remove or modify the `clearDatabase()` function
2. Use more secure default passwords
3. Add data validation
4. Consider using database migrations instead
5. Backup existing data before running

## Support

If you encounter any issues with the seeding scripts, please check:

1. MongoDB connection and permissions
2. Environment variables
3. Node.js and npm versions
4. Database schema compatibility

For additional support, contact the development team.
