const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const Admin = require('../src/models/coreModels/Admin');
const AdminPassword = require('../src/models/coreModels/AdminPassword');
const Role = require('../src/models/appModels/Role');
const Permission = require('../src/models/appModels/Permission');
const Client = require('../src/models/appModels/Client');
const Supplier = require('../src/models/appModels/Supplier');
const Employee = require('../src/models/appModels/Employee');
const Product = require('../src/models/appModels/Product');
const Location = require('../src/models/appModels/Location');
const InventoryRoll = require('../src/models/appModels/InventoryRoll');
const PosSale = require('../src/models/appModels/PosSale');
const Invoice = require('../src/models/appModels/Invoice');
const PurchaseOrder = require('../src/models/appModels/PurchaseOrder');
const Payroll = require('../src/models/appModels/Payroll');
const LedgerEntry = require('../src/models/appModels/LedgerEntry');

// Quick Pakistani cloth shop data (smaller dataset)
const quickData = {
  fabricTypes: ['Cotton', 'Silk', 'Wool', 'Polyester'],
  colors: ['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple'],
  cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'],
  customerNames: [
    'Ahmad Ali', 'Fatima Khan', 'Muhammad Hassan', 'Ayesha Ahmed', 'Ali Raza',
    'Sara Malik', 'Usman Sheikh', 'Zainab Qureshi', 'Hassan Shah', 'Amina Butt'
  ],
  suppliers: [
    { name: 'Al-Karam Textiles', companyName: 'Al-Karam Textile Mills Ltd', city: 'Karachi' },
    { name: 'Gul Ahmed', companyName: 'Gul Ahmed Textile Mills Ltd', city: 'Karachi' },
    { name: 'Nishat Mills', companyName: 'Nishat Mills Limited', city: 'Lahore' },
    { name: 'Chenab Limited', companyName: 'Chenab Limited', city: 'Faisalabad' },
    { name: 'Sapphire Textiles', companyName: 'Sapphire Textile Mills Ltd', city: 'Lahore' }
  ],
  employeeNames: [
    'Muhammad Asif', 'Aisha Bibi', 'Hassan Ali', 'Fatima Sheikh', 'Usman Khan'
  ],
  products: [
    // Cotton Fabrics
    { name: 'Premium Cotton Lawn', fabricType: 'Cotton', category: 'Summer Wear' },
    { name: 'Cotton Khadi', fabricType: 'Cotton', category: 'Traditional' },
    { name: 'Cotton Voile', fabricType: 'Cotton', category: 'Summer Wear' },
    { name: 'Cotton Poplin', fabricType: 'Cotton', category: 'Shirt Material' },
    { name: 'Cotton Jersey', fabricType: 'Cotton', category: 'T-Shirt Material' },
    
    // Silk Fabrics
    { name: 'Silk Chiffon', fabricType: 'Silk', category: 'Formal Wear' },
    { name: 'Silk Organza', fabricType: 'Silk', category: 'Bridal Wear' },
    { name: 'Silk Satin', fabricType: 'Silk', category: 'Formal Wear' },
    { name: 'Silk Georgette', fabricType: 'Silk', category: 'Formal Wear' },
    
    // Wool Fabrics
    { name: 'Woolen Suiting', fabricType: 'Wool', category: 'Winter Wear' },
    { name: 'Woolen Tweed', fabricType: 'Wool', category: 'Winter Suiting' },
    { name: 'Woolen Flannel', fabricType: 'Wool', category: 'Winter Wear' },
    
    // Polyester Fabrics
    { name: 'Polyester Georgette', fabricType: 'Polyester', category: 'Party Wear' },
    { name: 'Polyester Crepe', fabricType: 'Polyester', category: 'Party Wear' },
    { name: 'Polyester Chiffon', fabricType: 'Polyester', category: 'Party Wear' },
    
    // Ready-Made Garments
    { name: 'Men\'s Shalwar Kameez', fabricType: 'Cotton', category: 'Ready Made' },
    { name: 'Women\'s Shalwar Kameez', fabricType: 'Cotton', category: 'Ready Made' },
    { name: 'Men\'s Kurta', fabricType: 'Cotton', category: 'Ready Made' },
    { name: 'Women\'s Kurta', fabricType: 'Cotton', category: 'Ready Made' },
    
    // Home Textiles
    { name: 'Bed Sheet Set', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Pillow Covers', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Bath Towels', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Curtains', fabricType: 'Cotton', category: 'Home Textiles' },
    
    // Accessories
    { name: 'Scarf', fabricType: 'Silk', category: 'Accessories' },
    { name: 'Stole', fabricType: 'Silk', category: 'Accessories' },
    { name: 'Shawl', fabricType: 'Wool', category: 'Accessories' },
    { name: 'Tie', fabricType: 'Silk', category: 'Accessories' },
    
    // Special Fabrics
    { name: 'Embroidered Fabric', fabricType: 'Cotton', category: 'Traditional' },
    { name: 'Printed Fabric', fabricType: 'Cotton', category: 'Casual Wear' },
    { name: 'Block Print Fabric', fabricType: 'Cotton', category: 'Traditional' },
    { name: 'Net Fabric', fabricType: 'Polyester', category: 'Party Wear' },
    
    // Denim & Casual
    { name: 'Denim Fabric', fabricType: 'Denim', category: 'Casual Wear' },
    { name: 'Denim Stretch', fabricType: 'Denim', category: 'Casual Wear' },
    
    // Velvet & Luxury
    { name: 'Velvet Brocade', fabricType: 'Velvet', category: 'Formal Wear' },
    { name: 'Cotton Velvet', fabricType: 'Velvet', category: 'Formal Wear' }
  ]
};

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDecimal = (min, max, decimals = 2) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/erp-crm');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing data (skip admin, roles, permissions)
const clearDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing business data...');
    await Promise.all([
      // Skip Admin, Role, Permission - keep existing
      Client.deleteMany({}),
      Supplier.deleteMany({}),
      Employee.deleteMany({}),
      Product.deleteMany({}),
      Location.deleteMany({}),
      InventoryRoll.deleteMany({}),
      PosSale.deleteMany({}),
      Invoice.deleteMany({}),
      PurchaseOrder.deleteMany({}),
      Payroll.deleteMany({}),
      LedgerEntry.deleteMany({})
    ]);
    console.log('✅ Business data cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

// Quick seed function
const quickSeed = async () => {
  try {
    await connectDB();
    await clearDatabase();
    
    console.log('🌱 Starting quick database seeding...');
    
    // Get existing admin (skip creating new admin/roles)
    let admin = await Admin.findOne({ email: 'admin@binsultan.com' });
    
    if (!admin) {
      // Create a minimal admin without roles/permissions
      admin = await Admin.create({
        email: 'admin@binsultan.com',
        name: 'Bin Sultan',
        surname: 'Owner',
        enabled: true,
        systemRole: 'owner'
      });
      console.log('✅ Created minimal admin');
    } else {
      console.log('✅ Found existing admin');
    }
    
    // Check if admin has password record
    let adminPassword = await AdminPassword.findOne({ user: admin._id });
    
    if (!adminPassword) {
      // Create password record with default password 'admin123'
      const bcrypt = require('bcryptjs');
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(salt + 'admin123');
      
      adminPassword = await AdminPassword.create({
        user: admin._id,
        password: hashedPassword,
        salt: salt,
        emailVerified: true
      });
      console.log('✅ Created admin password (admin123)');
    } else {
      console.log('✅ Found existing admin password');
    }

    // Create location
    const location = await Location.create({
      code: 'MAIN-001',
      name: 'Main Store - Karachi',
      type: 'Store',
      address: {
        street: 'Tariq Road, Block 6',
        city: 'Karachi',
        state: 'Sindh',
        country: 'Pakistan',
        postalCode: '75300'
      },
      contact: {
        phone: '+92-21-1234567',
        email: 'main@binsultan.com',
        manager: 'Muhammad Asif'
      },
      capacity: { maxRolls: 1000, maxValue: 2000000 },
      isDefault: true,
      createdBy: admin._id
    });

    // Create suppliers
    const suppliers = [];
    for (let i = 0; i < quickData.suppliers.length; i++) {
      const supplierData = quickData.suppliers[i];
      const supplier = await Supplier.create({
        code: `SUP-${String(i + 1).padStart(3, '0')}`,
        name: supplierData.name,
        companyName: supplierData.companyName,
        contactPerson: supplierData.name,
        phone: `+92-${getRandomNumber(10, 99)}-${getRandomNumber(1000000, 9999999)}`,
        email: `${supplierData.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
        address: `${getRandomNumber(1, 999)} Main Street, ${supplierData.city}`,
        city: supplierData.city,
        country: 'Pakistan',
        taxNumber: `NTN-${getRandomNumber(1000000, 9999999)}`,
        creditLimit: getRandomDecimal(100000, 500000),
        currentBalance: getRandomDecimal(0, 100000),
        paymentTerms: 30,
        notes: `Reliable supplier for ${supplierData.city} region`,
        createdBy: admin._id
      });
      suppliers.push(supplier);
    }

    // Create employees
    const employees = [];
    const roleNames = ['Manager', 'Cashier', 'Salesperson', 'Helper', 'Admin'];
    
    for (let i = 0; i < quickData.employeeNames.length; i++) {
      const name = quickData.employeeNames[i];
      const roleName = roleNames[i % roleNames.length];
      
      const employee = await Employee.create({
        employeeId: `EMP-${String(i + 1).padStart(3, '0')}`,
        name: name,
        phone: `+92-${getRandomNumber(300, 399)}-${getRandomNumber(1000000, 9999999)}`,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@binsultan.com`,
        address: `${getRandomNumber(1, 999)} ${getRandomElement(quickData.cities)} Street, ${getRandomElement(quickData.cities)}`,
        role: roleName,
        salaryType: roleName === 'Manager' ? 'Fixed' : getRandomElement(['Fixed', 'Commission', 'Hybrid']),
        baseSalary: roleName === 'Manager' ? getRandomDecimal(50000, 80000) : getRandomDecimal(30000, 60000),
        commissionRate: roleName === 'Manager' ? 0 : getRandomDecimal(2, 8),
        joiningDate: getRandomDate(new Date(2022, 0, 1), new Date(2023, 11, 31)),
        active: true,
        emergencyContact: {
          name: `${name.split(' ')[0]} ${getRandomElement(['Khan', 'Ahmed', 'Ali', 'Sheikh'])}`,
          phone: `+92-${getRandomNumber(300, 399)}-${getRandomNumber(1000000, 9999999)}`,
          relationship: getRandomElement(['Father', 'Mother', 'Brother', 'Sister'])
        },
        notes: `Experienced ${roleName.toLowerCase()} in textile business`,
        createdBy: admin._id
      });
      employees.push(employee);
    }

    // Create products
    const products = [];
    for (let i = 0; i < quickData.products.length; i++) {
      const productData = quickData.products[i];
      const color = getRandomElement(quickData.colors);
      const supplier = getRandomElement(suppliers);
      
      const costPrice = getRandomDecimal(200, 1000);
      const minSalePrice = costPrice * 1.3;
      const maxSalePrice = costPrice * 2.0;
      
      const product = await Product.create({
        code: `FAB-${String(i + 1).padStart(3, '0')}`,
        name: `${productData.name} - ${color}`,
        fabricType: productData.fabricType,
        color: color,
        size: 'Standard',
        description: `High quality ${productData.fabricType.toLowerCase()} fabric in ${color.toLowerCase()} color.`,
        images: [`/images/products/fabric-${i + 1}.jpg`],
        pricing: {
          minSalePrice: minSalePrice,
          maxSalePrice: maxSalePrice,
          defaultUnit: 'm',
          costPrice: costPrice
        },
        supplier: supplier._id,
        category: productData.category,
        tags: [productData.fabricType, color, productData.category],
        barcode: `BAR-${Date.now()}-${i}`,
        sku: `SKU-${productData.fabricType.toUpperCase()}-${i + 1}`,
        createdBy: admin._id
      });
      products.push(product);
    }

    // Create inventory rolls
    const inventoryRolls = [];
    let rollCounter = 1;
    
    for (const product of products) {
      const rollCount = getRandomNumber(2, 4);
      
      for (let i = 0; i < rollCount; i++) {
        const initLength = getRandomDecimal(50, 150);
        const remainingLength = getRandomDecimal(20, initLength);
        
        const roll = await InventoryRoll.create({
          rollNumber: `ROLL-${String(rollCounter).padStart(4, '0')}`,
          barcode: `ROLL-BAR-${rollCounter}`,
          product: product._id,
          supplier: product.supplier,
          batchNumber: `BATCH-${getRandomNumber(1000, 9999)}`,
          initLength: initLength,
          remainingLength: remainingLength,
          unit: 'm',
          status: remainingLength > 20 ? 'Available' : 'Low Stock',
          isTail: remainingLength < 5,
          minCutLength: 1.0,
          costPerUnit: product.pricing.costPrice,
          receivedAt: getRandomDate(new Date(2023, 0, 1), new Date()),
          location: location._id,
          locationName: location.name,
          notes: `Fresh stock`,
          createdBy: admin._id
        });
        
        inventoryRolls.push(roll);
        rollCounter++;
      }
    }

    // Create customers
    const customers = [];
    for (let i = 0; i < quickData.customerNames.length; i++) {
      const name = quickData.customerNames[i];
      const city = getRandomElement(quickData.cities);
      
      const customer = await Client.create({
        name: name,
        phone: `+92-${getRandomNumber(300, 399)}-${getRandomNumber(1000000, 9999999)}`,
        country: 'Pakistan',
        address: `${getRandomNumber(1, 999)} ${city} Street, ${city}`,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@email.com`,
        createdBy: admin._id,
        assigned: admin._id
      });
      customers.push(customer);
    }

    // Create some POS sales
    const sales = [];
    const startDate = new Date(2023, 6, 1); // Last 6 months
    const endDate = new Date();
    
    for (let i = 0; i < 50; i++) {
      const customer = Math.random() > 0.4 ? getRandomElement(customers) : null;
      const employee = getRandomElement(employees);
      const saleDate = getRandomDate(startDate, endDate);
      
      const itemCount = getRandomNumber(1, 3);
      const items = [];
      let subtotal = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const product = getRandomElement(products);
        const roll = inventoryRolls.find(r => r.product.equals(product._id) && r.status === 'Available');
        if (!roll) continue;
        
        const quantity = getRandomDecimal(1, 5);
        const unitPrice = getRandomDecimal(
          parseFloat(product.pricing.minSalePrice),
          parseFloat(product.pricing.maxSalePrice)
        );
        const total = quantity * unitPrice;
        
        items.push({
          product: product._id,
          roll: roll._id,
          quantity: quantity,
          unit: 'm',
          unitPrice: unitPrice,
          total: total
        });
        
        subtotal += total;
      }
      
      if (items.length === 0) continue;
      
      const discount = Math.random() > 0.8 ? getRandomDecimal(0, subtotal * 0.1) : 0;
      const tax = (subtotal - discount) * 0.15;
      const grandTotal = subtotal - discount + tax;
      
      const paymentMethod = getRandomElement(['Cash', 'Credit Card', 'Bank Transfer']);
      const receivedAmount = paymentMethod === 'Cash' ? grandTotal + getRandomDecimal(0, 50) : grandTotal;
      const change = receivedAmount - grandTotal;
      
      const sale = await PosSale.create({
        customer: customer?._id,
        employee: employee._id,
        items: items,
        subtotal: subtotal,
        discount: discount,
        bargainDiscount: 0,
        tax: tax,
        grandTotal: grandTotal,
        paymentMethod: paymentMethod,
        receivedAmount: receivedAmount,
        change: change,
        status: 'completed',
        notes: customer ? `Regular customer` : `Walk-in customer`,
        createdAt: saleDate,
        updatedAt: saleDate
      });
      
      sales.push(sale);
    }

    // Create some invoices
    const invoices = [];
    for (let i = 0; i < 20; i++) {
      const customer = getRandomElement(customers);
      const invoiceDate = getRandomDate(startDate, endDate);
      const expiredDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const itemCount = getRandomNumber(1, 2);
      const items = [];
      let subtotal = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const itemName = getRandomElement([
          'Premium Cotton Lawn', 'Silk Chiffon', 'Woolen Suiting', 'Cotton Khadi'
        ]);
        const quantity = getRandomNumber(1, 3);
        const price = getRandomDecimal(500, 2000);
        const total = quantity * price;
        
        items.push({
          itemName: itemName,
          description: `High quality ${itemName.toLowerCase()} fabric`,
          quantity: quantity,
          price: price,
          total: total
        });
        
        subtotal += total;
      }
      
      const taxRate = 15;
      const taxTotal = subtotal * (taxRate / 100);
      const total = subtotal + taxTotal;
      
      const invoice = await Invoice.create({
        createdBy: admin._id,
        number: i + 1,
        year: invoiceDate.getFullYear(),
        date: invoiceDate,
        expiredDate: expiredDate,
        client: customer._id,
        items: items,
        taxRate: taxRate,
        subTotal: subtotal,
        taxTotal: taxTotal,
        total: total,
        currency: 'PKR',
        credit: 0,
        discount: 0,
        paymentStatus: getRandomElement(['unpaid', 'paid', 'partially']),
        isOverdue: expiredDate < new Date() && Math.random() > 0.5,
        approved: true,
        notes: `Invoice for ${customer.name}`,
        status: getRandomElement(['sent', 'pending'])
      });
      
      invoices.push(invoice);
    }

    console.log('🎉 Quick database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`👤 Admins: 1`);
    console.log(`🏭 Suppliers: ${suppliers.length}`);
    console.log(`👥 Employees: ${employees.length}`);
    console.log(`🧵 Products: ${products.length}`);
    console.log(`📦 Inventory Rolls: ${inventoryRolls.length}`);
    console.log(`👥 Customers: ${customers.length}`);
    console.log(`💰 POS Sales: ${sales.length}`);
    console.log(`📄 Invoices: ${invoices.length}`);
    console.log(`📍 Locations: 1`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Email: admin@binsultan.com');
    console.log('Password: admin123 (if using default auth)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Quick seeding failed:', error);
    process.exit(1);
  }
};

// Run quick seeding
if (require.main === module) {
  quickSeed();
}

module.exports = { quickSeed };
