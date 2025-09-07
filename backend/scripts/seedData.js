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

// Pakistani cloth shop data
const pakistaniClothData = {
  // Pakistani fabric types and colors
  fabricTypes: ['Cotton', 'Silk', 'Wool', 'Polyester', 'Linen', 'Denim', 'Velvet'],
  colors: [
    'White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange',
    'Brown', 'Grey', 'Maroon', 'Navy', 'Sky Blue', 'Cream', 'Beige', 'Gold', 'Silver',
    'Turquoise', 'Magenta', 'Lime', 'Indigo', 'Coral', 'Teal', 'Burgundy'
  ],
  
  // Pakistani cities
  cities: [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar',
    'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah',
    'Mirpur Khas', 'Jacobabad', 'Shikarpur', 'Khairpur', 'Dadu', 'Thatta'
  ],
  
  // Pakistani names
  customerNames: [
    'Ahmad Ali', 'Fatima Khan', 'Muhammad Hassan', 'Ayesha Ahmed', 'Ali Raza', 'Sara Malik',
    'Usman Sheikh', 'Zainab Qureshi', 'Hassan Shah', 'Amina Butt', 'Omar Farooq', 'Khadija Ali',
    'Bilal Ahmad', 'Maryam Khan', 'Tariq Hussain', 'Nadia Sheikh', 'Imran Ali', 'Saima Malik',
    'Kashif Ahmed', 'Rubina Khan', 'Nadeem Sheikh', 'Farah Ali', 'Rashid Ahmad', 'Hina Malik',
    'Shahid Khan', 'Nazia Ahmed', 'Waseem Ali', 'Sadia Sheikh', 'Javed Ahmad', 'Tahira Khan'
  ],
  
  // Pakistani supplier companies
  suppliers: [
    { name: 'Al-Karam Textiles', companyName: 'Al-Karam Textile Mills Ltd', city: 'Karachi' },
    { name: 'Gul Ahmed', companyName: 'Gul Ahmed Textile Mills Ltd', city: 'Karachi' },
    { name: 'Nishat Mills', companyName: 'Nishat Mills Limited', city: 'Lahore' },
    { name: 'Chenab Limited', companyName: 'Chenab Limited', city: 'Faisalabad' },
    { name: 'Sapphire Textiles', companyName: 'Sapphire Textile Mills Ltd', city: 'Lahore' },
    { name: 'Kohinoor Mills', companyName: 'Kohinoor Textile Mills Ltd', city: 'Rawalpindi' },
    { name: 'Fazal Cloth', companyName: 'Fazal Cloth House', city: 'Karachi' },
    { name: 'Pak Silk', companyName: 'Pakistan Silk Industries', city: 'Lahore' },
    { name: 'Royal Textiles', companyName: 'Royal Textile Mills', city: 'Faisalabad' },
    { name: 'Premium Fabrics', companyName: 'Premium Fabric House', city: 'Karachi' }
  ],
  
  // Pakistani employee names
  employeeNames: [
    'Muhammad Asif', 'Aisha Bibi', 'Hassan Ali', 'Fatima Sheikh', 'Usman Khan', 'Zara Ahmed',
    'Bilal Malik', 'Sana Khan', 'Tariq Ali', 'Nadia Sheikh', 'Imran Ahmad', 'Saima Butt',
    'Kashif Khan', 'Rubina Ali', 'Nadeem Sheikh', 'Farah Malik', 'Rashid Ahmed', 'Hina Khan'
  ],
  
  // Pakistani fabric products - Expanded variety
  products: [
    // Cotton Fabrics
    { name: 'Premium Cotton Lawn', fabricType: 'Cotton', category: 'Summer Wear' },
    { name: 'Cotton Khadi', fabricType: 'Cotton', category: 'Traditional' },
    { name: 'Cotton Voile', fabricType: 'Cotton', category: 'Summer Wear' },
    { name: 'Cotton Poplin', fabricType: 'Cotton', category: 'Shirt Material' },
    { name: 'Cotton Muslin', fabricType: 'Cotton', category: 'Summer Wear' },
    { name: 'Cotton Cambric', fabricType: 'Cotton', category: 'Summer Wear' },
    { name: 'Cotton Twill', fabricType: 'Cotton', category: 'Casual Wear' },
    { name: 'Cotton Canvas', fabricType: 'Cotton', category: 'Heavy Duty' },
    { name: 'Cotton Jersey', fabricType: 'Cotton', category: 'T-Shirt Material' },
    { name: 'Cotton Terry', fabricType: 'Cotton', category: 'Towels' },
    
    // Silk Fabrics
    { name: 'Silk Chiffon', fabricType: 'Silk', category: 'Formal Wear' },
    { name: 'Silk Organza', fabricType: 'Silk', category: 'Bridal Wear' },
    { name: 'Silk Satin', fabricType: 'Silk', category: 'Formal Wear' },
    { name: 'Silk Crepe', fabricType: 'Silk', category: 'Party Wear' },
    { name: 'Silk Georgette', fabricType: 'Silk', category: 'Formal Wear' },
    { name: 'Silk Dupion', fabricType: 'Silk', category: 'Bridal Wear' },
    { name: 'Silk Taffeta', fabricType: 'Silk', category: 'Formal Wear' },
    { name: 'Silk Brocade', fabricType: 'Silk', category: 'Traditional' },
    
    // Wool Fabrics
    { name: 'Woolen Suiting', fabricType: 'Wool', category: 'Winter Wear' },
    { name: 'Woolen Tweed', fabricType: 'Wool', category: 'Winter Suiting' },
    { name: 'Woolen Flannel', fabricType: 'Wool', category: 'Winter Wear' },
    { name: 'Woolen Gabardine', fabricType: 'Wool', category: 'Formal Wear' },
    { name: 'Woolen Melton', fabricType: 'Wool', category: 'Coats' },
    { name: 'Woolen Cashmere', fabricType: 'Wool', category: 'Premium Winter' },
    
    // Polyester Fabrics
    { name: 'Polyester Georgette', fabricType: 'Polyester', category: 'Party Wear' },
    { name: 'Polyester Crepe', fabricType: 'Polyester', category: 'Party Wear' },
    { name: 'Polyester Chiffon', fabricType: 'Polyester', category: 'Party Wear' },
    { name: 'Polyester Satin', fabricType: 'Polyester', category: 'Formal Wear' },
    { name: 'Polyester Taffeta', fabricType: 'Polyester', category: 'Party Wear' },
    { name: 'Polyester Organza', fabricType: 'Polyester', category: 'Party Wear' },
    
    // Linen Fabrics
    { name: 'Linen Cotton Mix', fabricType: 'Linen', category: 'Casual Wear' },
    { name: 'Pure Linen', fabricType: 'Linen', category: 'Summer Wear' },
    { name: 'Linen Canvas', fabricType: 'Linen', category: 'Heavy Duty' },
    { name: 'Linen Voile', fabricType: 'Linen', category: 'Summer Wear' },
    
    // Denim & Casual
    { name: 'Denim Fabric', fabricType: 'Denim', category: 'Casual Wear' },
    { name: 'Denim Stretch', fabricType: 'Denim', category: 'Casual Wear' },
    { name: 'Denim Light', fabricType: 'Denim', category: 'Summer Casual' },
    
    // Velvet & Luxury
    { name: 'Velvet Brocade', fabricType: 'Velvet', category: 'Formal Wear' },
    { name: 'Cotton Velvet', fabricType: 'Velvet', category: 'Formal Wear' },
    { name: 'Silk Velvet', fabricType: 'Velvet', category: 'Luxury' },
    { name: 'Crushed Velvet', fabricType: 'Velvet', category: 'Party Wear' },
    
    // Ready-Made Garments
    { name: 'Men\'s Shalwar Kameez', fabricType: 'Cotton', category: 'Ready Made' },
    { name: 'Women\'s Shalwar Kameez', fabricType: 'Cotton', category: 'Ready Made' },
    { name: 'Men\'s Kurta', fabricType: 'Cotton', category: 'Ready Made' },
    { name: 'Women\'s Kurta', fabricType: 'Cotton', category: 'Ready Made' },
    { name: 'Men\'s Waistcoat', fabricType: 'Wool', category: 'Ready Made' },
    { name: 'Women\'s Dupatta', fabricType: 'Silk', category: 'Ready Made' },
    { name: 'Men\'s Pajama', fabricType: 'Cotton', category: 'Ready Made' },
    { name: 'Women\'s Pajama', fabricType: 'Cotton', category: 'Ready Made' },
    
    // Home Textiles
    { name: 'Bed Sheet Set', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Pillow Covers', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Curtains', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Table Cloth', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Bath Towels', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Hand Towels', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Kitchen Towels', fabricType: 'Cotton', category: 'Home Textiles' },
    { name: 'Bedsheet', fabricType: 'Cotton', category: 'Home Textiles' },
    
    // Accessories
    { name: 'Scarf', fabricType: 'Silk', category: 'Accessories' },
    { name: 'Stole', fabricType: 'Silk', category: 'Accessories' },
    { name: 'Shawl', fabricType: 'Wool', category: 'Accessories' },
    { name: 'Handkerchief', fabricType: 'Cotton', category: 'Accessories' },
    { name: 'Tie', fabricType: 'Silk', category: 'Accessories' },
    { name: 'Pocket Square', fabricType: 'Silk', category: 'Accessories' },
    
    // Special Fabrics
    { name: 'Net Fabric', fabricType: 'Polyester', category: 'Party Wear' },
    { name: 'Lace Fabric', fabricType: 'Polyester', category: 'Party Wear' },
    { name: 'Embroidered Fabric', fabricType: 'Cotton', category: 'Traditional' },
    { name: 'Printed Fabric', fabricType: 'Cotton', category: 'Casual Wear' },
    { name: 'Block Print Fabric', fabricType: 'Cotton', category: 'Traditional' },
    { name: 'Tie-Dye Fabric', fabricType: 'Cotton', category: 'Casual Wear' },
    { name: 'Batik Fabric', fabricType: 'Cotton', category: 'Traditional' },
    { name: 'Kalamkari Fabric', fabricType: 'Cotton', category: 'Traditional' },
    
    // Seasonal Fabrics
    { name: 'Summer Lawn', fabricType: 'Cotton', category: 'Summer Wear' },
    { name: 'Winter Flannel', fabricType: 'Wool', category: 'Winter Wear' },
    { name: 'Monsoon Cotton', fabricType: 'Cotton', category: 'Rainy Season' },
    { name: 'Spring Chiffon', fabricType: 'Silk', category: 'Spring Wear' },
    
    // Work Wear
    { name: 'Work Shirt Fabric', fabricType: 'Cotton', category: 'Work Wear' },
    { name: 'Uniform Fabric', fabricType: 'Polyester', category: 'Work Wear' },
    { name: 'Apron Fabric', fabricType: 'Cotton', category: 'Work Wear' },
    { name: 'Lab Coat Fabric', fabricType: 'Cotton', category: 'Work Wear' }
  ]
};

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
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

// Get existing admin (skip creating new admin/roles)
const getExistingAdmin = async () => {
  try {
    console.log('👤 Looking for existing admin...');
    
    // Try to find existing admin
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
    
    return { admin, roles: null };
  } catch (error) {
    console.error('❌ Error getting admin:', error);
    throw error;
  }
};

// Seed Locations
const seedLocations = async (admin) => {
  try {
    console.log('📍 Seeding Locations...');
    
    const locations = await Location.insertMany([
      {
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
        capacity: { maxRolls: 2000, maxValue: 5000000 },
        isDefault: true,
        createdBy: admin._id
      },
      {
        code: 'WH-001',
        name: 'Warehouse - Lahore',
        type: 'Warehouse',
        address: {
          street: 'Industrial Area, Phase 2',
          city: 'Lahore',
          state: 'Punjab',
          country: 'Pakistan',
          postalCode: '54000'
        },
        contact: {
          phone: '+92-42-7654321',
          email: 'warehouse@binsultan.com',
          manager: 'Hassan Ali'
        },
        capacity: { maxRolls: 5000, maxValue: 10000000 },
        createdBy: admin._id
      },
      {
        code: 'SHOW-001',
        name: 'Showroom - Islamabad',
        type: 'Showroom',
        address: {
          street: 'Blue Area, F-6',
          city: 'Islamabad',
          state: 'Federal',
          country: 'Pakistan',
          postalCode: '44000'
        },
        contact: {
          phone: '+92-51-9876543',
          email: 'showroom@binsultan.com',
          manager: 'Aisha Bibi'
        },
        capacity: { maxRolls: 1000, maxValue: 2000000 },
        createdBy: admin._id
      }
    ]);

    console.log('✅ Locations seeded');
    return locations;
  } catch (error) {
    console.error('❌ Error seeding locations:', error);
    throw error;
  }
};

// Seed Suppliers
const seedSuppliers = async (admin) => {
  try {
    console.log('🏭 Seeding Suppliers...');
    
    const suppliers = [];
    for (let i = 0; i < pakistaniClothData.suppliers.length; i++) {
      const supplierData = pakistaniClothData.suppliers[i];
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
        creditLimit: getRandomDecimal(100000, 1000000),
        currentBalance: getRandomDecimal(0, 500000),
        paymentTerms: getRandomNumber(15, 60),
        notes: `Reliable supplier for ${supplierData.city} region`,
        createdBy: admin._id
      });
      suppliers.push(supplier);
    }

    console.log('✅ Suppliers seeded');
    return suppliers;
  } catch (error) {
    console.error('❌ Error seeding suppliers:', error);
    throw error;
  }
};

// Seed Employees
const seedEmployees = async (admin) => {
  try {
    console.log('👥 Seeding Employees...');
    
    const employees = [];
    const roleNames = ['Manager', 'Cashier', 'Salesperson', 'Helper', 'Admin'];
    
    for (let i = 0; i < pakistaniClothData.employeeNames.length; i++) {
      const name = pakistaniClothData.employeeNames[i];
      const roleName = roleNames[i % roleNames.length];
      
      const employee = await Employee.create({
        employeeId: `EMP-${String(i + 1).padStart(3, '0')}`,
        name: name,
        phone: `+92-${getRandomNumber(300, 399)}-${getRandomNumber(1000000, 9999999)}`,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@binsultan.com`,
        address: `${getRandomNumber(1, 999)} ${getRandomElement(pakistaniClothData.cities)} Street, ${getRandomElement(pakistaniClothData.cities)}`,
        role: roleName,
        salaryType: roleName === 'Manager' ? 'Fixed' : getRandomElement(['Fixed', 'Commission', 'Hybrid']),
        baseSalary: roleName === 'Manager' ? getRandomDecimal(80000, 120000) : getRandomDecimal(30000, 60000),
        commissionRate: roleName === 'Manager' ? 0 : getRandomDecimal(2, 8),
        joiningDate: getRandomDate(new Date(2020, 0, 1), new Date(2023, 11, 31)),
        active: true,
        emergencyContact: {
          name: `${name.split(' ')[0]} ${getRandomElement(['Khan', 'Ahmed', 'Ali', 'Sheikh', 'Malik'])}`,
          phone: `+92-${getRandomNumber(300, 399)}-${getRandomNumber(1000000, 9999999)}`,
          relationship: getRandomElement(['Father', 'Mother', 'Brother', 'Sister', 'Spouse'])
        },
        notes: `Experienced ${roleName.toLowerCase()} in textile business`,
        createdBy: admin._id
      });
      employees.push(employee);
    }

    console.log('✅ Employees seeded');
    return employees;
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
    throw error;
  }
};

// Seed Products
const seedProducts = async (admin, suppliers) => {
  try {
    console.log('🧵 Seeding Products...');
    
    const products = [];
    for (let i = 0; i < pakistaniClothData.products.length; i++) {
      const productData = pakistaniClothData.products[i];
      const color = getRandomElement(pakistaniClothData.colors);
      const supplier = getRandomElement(suppliers);
      
      const costPrice = getRandomDecimal(200, 2000);
      const minSalePrice = costPrice * 1.3;
      const maxSalePrice = costPrice * 2.0;
      
      const product = await Product.create({
        code: `FAB-${String(i + 1).padStart(3, '0')}`,
        name: `${productData.name} - ${color}`,
        fabricType: productData.fabricType,
        color: color,
        size: 'Standard',
        description: `High quality ${productData.fabricType.toLowerCase()} fabric in ${color.toLowerCase()} color. Perfect for ${productData.category.toLowerCase()}.`,
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

    console.log('✅ Products seeded');
    return products;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

// Seed Inventory Rolls
const seedInventoryRolls = async (admin, products, suppliers, locations) => {
  try {
    console.log('📦 Seeding Inventory Rolls...');
    
    const inventoryRolls = [];
    let rollCounter = 1;
    
    for (const product of products) {
      // Create 3-8 rolls per product
      const rollCount = getRandomNumber(3, 8);
      
      for (let i = 0; i < rollCount; i++) {
        const initLength = getRandomDecimal(50, 200);
        const remainingLength = getRandomDecimal(10, initLength);
        const location = getRandomElement(locations);
        
        const roll = await InventoryRoll.create({
          rollNumber: `ROLL-${String(rollCounter).padStart(4, '0')}`,
          barcode: `ROLL-BAR-${rollCounter}`,
          product: product._id,
          supplier: product.supplier,
          batchNumber: `BATCH-${getRandomNumber(1000, 9999)}`,
          initLength: initLength,
          remainingLength: remainingLength,
          unit: 'm',
          status: remainingLength > 20 ? 'Available' : remainingLength > 5 ? 'Low Stock' : 'Reserved',
          isTail: remainingLength < 5,
          minCutLength: 1.0,
          costPerUnit: product.pricing.costPrice,
          receivedAt: getRandomDate(new Date(2023, 0, 1), new Date()),
          location: location._id,
          locationName: location.name,
          notes: `Fresh stock received from ${suppliers.find(s => s._id.equals(product.supplier))?.name}`,
          createdBy: admin._id
        });
        
        inventoryRolls.push(roll);
        rollCounter++;
      }
    }

    console.log('✅ Inventory Rolls seeded');
    return inventoryRolls;
  } catch (error) {
    console.error('❌ Error seeding inventory rolls:', error);
    throw error;
  }
};

// Seed Customers
const seedCustomers = async (admin) => {
  try {
    console.log('👥 Seeding Customers...');
    
    const customers = [];
    for (let i = 0; i < pakistaniClothData.customerNames.length; i++) {
      const name = pakistaniClothData.customerNames[i];
      const city = getRandomElement(pakistaniClothData.cities);
      
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

    console.log('✅ Customers seeded');
    return customers;
  } catch (error) {
    console.error('❌ Error seeding customers:', error);
    throw error;
  }
};

// Seed POS Sales
const seedPosSales = async (customers, employees, products, inventoryRolls) => {
  try {
    console.log('💰 Seeding POS Sales...');
    
    const sales = [];
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date();
    
    for (let i = 0; i < 200; i++) {
      const customer = Math.random() > 0.3 ? getRandomElement(customers) : null; // 30% walk-in customers
      const employee = getRandomElement(employees);
      const saleDate = getRandomDate(startDate, endDate);
      
      // Create 1-5 items per sale
      const itemCount = getRandomNumber(1, 5);
      const items = [];
      let subtotal = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const product = getRandomElement(products);
        const roll = inventoryRolls.find(r => r.product.equals(product._id) && r.status === 'Available');
        if (!roll) continue;
        
        const quantity = getRandomDecimal(1, 10);
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
      
      const discount = Math.random() > 0.7 ? getRandomDecimal(0, subtotal * 0.1) : 0;
      const bargainDiscount = Math.random() > 0.8 ? getRandomDecimal(0, subtotal * 0.05) : 0;
      const tax = (subtotal - discount - bargainDiscount) * 0.15; // 15% tax
      const grandTotal = subtotal - discount - bargainDiscount + tax;
      
      const paymentMethod = getRandomElement(['Cash', 'Credit Card', 'Bank Transfer', 'Mobile Payment']);
      const receivedAmount = paymentMethod === 'Cash' ? grandTotal + getRandomDecimal(0, 100) : grandTotal;
      const change = receivedAmount - grandTotal;
      
      const sale = await PosSale.create({
        customer: customer?._id,
        employee: employee._id,
        items: items,
        subtotal: subtotal,
        discount: discount,
        bargainDiscount: bargainDiscount,
        tax: tax,
        grandTotal: grandTotal,
        paymentMethod: paymentMethod,
        receivedAmount: receivedAmount,
        change: change,
        status: 'completed',
        notes: customer ? `Regular customer purchase` : `Walk-in customer`,
        createdAt: saleDate,
        updatedAt: saleDate
      });
      
      sales.push(sale);
    }

    console.log('✅ POS Sales seeded');
    return sales;
  } catch (error) {
    console.error('❌ Error seeding POS sales:', error);
    throw error;
  }
};

// Seed Invoices
const seedInvoices = async (admin, customers) => {
  try {
    console.log('📄 Seeding Invoices...');
    
    const invoices = [];
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date();
    
    for (let i = 0; i < 50; i++) {
      const customer = getRandomElement(customers);
      const invoiceDate = getRandomDate(startDate, endDate);
      const expiredDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later
      
      // Create 1-3 items per invoice
      const itemCount = getRandomNumber(1, 3);
      const items = [];
      let subtotal = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const itemName = getRandomElement([
          'Premium Cotton Lawn', 'Silk Chiffon', 'Woolen Suiting', 'Cotton Khadi',
          'Polyester Georgette', 'Linen Cotton Mix', 'Denim Fabric', 'Velvet Brocade'
        ]);
        const quantity = getRandomNumber(1, 5);
        const price = getRandomDecimal(500, 3000);
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
      
      const taxRate = 15; // 15% tax
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
        status: getRandomElement(['sent', 'pending', 'draft'])
      });
      
      invoices.push(invoice);
    }

    console.log('✅ Invoices seeded');
    return invoices;
  } catch (error) {
    console.error('❌ Error seeding invoices:', error);
    throw error;
  }
};

// Seed Purchase Orders
const seedPurchaseOrders = async (admin, suppliers, products) => {
  try {
    console.log('📋 Seeding Purchase Orders...');
    
    const purchaseOrders = [];
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const supplier = getRandomElement(suppliers);
      const orderDate = getRandomDate(startDate, endDate);
      const expectedDeliveryDate = new Date(orderDate.getTime() + getRandomNumber(7, 30) * 24 * 60 * 60 * 1000);
      
      // Create 2-5 items per purchase order
      const itemCount = getRandomNumber(2, 5);
      const items = [];
      let subtotal = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const product = getRandomElement(products);
        const quantity = getRandomDecimal(50, 200);
        const unitPrice = parseFloat(product.pricing.costPrice);
        const totalPrice = quantity * unitPrice;
        const receivedQuantity = Math.random() > 0.3 ? getRandomDecimal(0, quantity) : 0;
        const remainingQuantity = quantity - receivedQuantity;
        
        items.push({
          product: product._id,
          quantity: quantity,
          unit: 'm',
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          receivedQuantity: receivedQuantity,
          remainingQuantity: remainingQuantity
        });
        
        subtotal += totalPrice;
      }
      
      const taxRate = 15; // 15% tax
      const taxAmount = subtotal * (taxRate / 100);
      const totalAmount = subtotal + taxAmount;
      
      const status = Math.random() > 0.7 ? 'Received' : 
                   Math.random() > 0.5 ? 'Partially Received' : 
                   Math.random() > 0.3 ? 'Ordered' : 'Created';
      
      const actualDeliveryDate = status === 'Received' ? 
        new Date(expectedDeliveryDate.getTime() + getRandomNumber(-5, 10) * 24 * 60 * 60 * 1000) : 
        undefined;
      
      const purchaseOrder = await PurchaseOrder.create({
        supplier: supplier._id,
        items: items,
        status: status,
        orderDate: orderDate,
        expectedDeliveryDate: expectedDeliveryDate,
        actualDeliveryDate: actualDeliveryDate,
        subtotal: subtotal,
        taxRate: taxRate,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
        notes: `Purchase order for ${supplier.name}`,
        terms: 'Net 30 days',
        createdBy: admin._id,
        approvedBy: admin._id,
        approvedAt: orderDate
      });
      
      purchaseOrders.push(purchaseOrder);
    }

    console.log('✅ Purchase Orders seeded');
    return purchaseOrders;
  } catch (error) {
    console.error('❌ Error seeding purchase orders:', error);
    throw error;
  }
};

// Seed Payroll
const seedPayroll = async (admin, employees) => {
  try {
    console.log('💼 Seeding Payroll...');
    
    const payrolls = [];
    const currentYear = new Date().getFullYear();
    
    for (const employee of employees) {
      for (let month = 1; month <= 12; month++) {
        const baseSalary = parseFloat(employee.baseSalary);
        const commissionRate = parseFloat(employee.commissionRate);
        
        // Calculate earnings
        const earnings = [
          {
            type: 'Base Salary',
            amount: baseSalary,
            description: 'Monthly base salary'
          }
        ];
        
        if (commissionRate > 0) {
          const salesAmount = getRandomDecimal(50000, 200000);
          const commission = salesAmount * (commissionRate / 100);
          earnings.push({
            type: 'Commission',
            amount: commission,
            description: `Commission on sales of PKR ${salesAmount.toFixed(2)}`
          });
        }
        
        // Calculate deductions
        const deductions = [
          {
            type: 'Tax',
            amount: baseSalary * 0.1, // 10% tax
            description: 'Income tax deduction'
          }
        ];
        
        const totalEarnings = earnings.reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
        const totalDeductions = deductions.reduce((sum, deduction) => sum + parseFloat(deduction.amount), 0);
        const netPay = totalEarnings - totalDeductions;
        
        const payroll = await Payroll.create({
          employee: employee._id,
          period: { month: month, year: currentYear },
          earnings: earnings,
          deductions: deductions,
          totalEarnings: totalEarnings,
          totalDeductions: totalDeductions,
          netPay: netPay,
          paid: Math.random() > 0.2, // 80% paid
          paidAt: Math.random() > 0.2 ? new Date(currentYear, month - 1, getRandomNumber(1, 28)) : undefined,
          paymentMethod: getRandomElement(['Cash', 'Bank Transfer', 'Check']),
          paymentReference: `PAY-${currentYear}-${String(month).padStart(2, '0')}-${employee.employeeId}`,
          salesTarget: getRandomDecimal(100000, 300000),
          actualSales: getRandomDecimal(80000, 250000),
          commissionEarned: commissionRate > 0 ? getRandomDecimal(2000, 15000) : 0,
          notes: `Payroll for ${employee.name} - ${month}/${currentYear}`,
          createdBy: admin._id
        });
        
        payrolls.push(payroll);
      }
    }

    console.log('✅ Payroll seeded');
    return payrolls;
  } catch (error) {
    console.error('❌ Error seeding payroll:', error);
    throw error;
  }
};

// Seed Ledger Entries
const seedLedgerEntries = async (admin, customers, suppliers, employees, sales, invoices) => {
  try {
    console.log('📊 Seeding Ledger Entries...');
    
    const ledgerEntries = [];
    
    // Customer ledger entries
    for (const customer of customers) {
      let balance = 0;
      
      // Add some sales entries
      for (let i = 0; i < getRandomNumber(5, 15); i++) {
        const amount = getRandomDecimal(1000, 10000);
        balance += amount;
        
        const entry = await LedgerEntry.create({
          partyType: 'Customer',
          partyId: customer._id,
          partyModel: 'Client',
          entryType: 'Sale',
          debit: amount,
          credit: 0,
          balance: balance,
          date: getRandomDate(new Date(2023, 0, 1), new Date()),
          description: `Sale to ${customer.name}`,
          notes: 'Fabric sale transaction',
          createdBy: admin._id
        });
        
        ledgerEntries.push(entry);
      }
      
      // Add some payment entries
      for (let i = 0; i < getRandomNumber(2, 8); i++) {
        const amount = getRandomDecimal(500, 5000);
        balance -= amount;
        
        const entry = await LedgerEntry.create({
          partyType: 'Customer',
          partyId: customer._id,
          partyModel: 'Client',
          entryType: 'Payment',
          debit: 0,
          credit: amount,
          balance: balance,
          date: getRandomDate(new Date(2023, 0, 1), new Date()),
          description: `Payment received from ${customer.name}`,
          notes: 'Customer payment',
          createdBy: admin._id
        });
        
        ledgerEntries.push(entry);
      }
    }
    
    // Supplier ledger entries
    for (const supplier of suppliers) {
      let balance = 0;
      
      // Add some purchase entries
      for (let i = 0; i < getRandomNumber(3, 10); i++) {
        const amount = getRandomDecimal(5000, 50000);
        balance += amount;
        
        const entry = await LedgerEntry.create({
          partyType: 'Supplier',
          partyId: supplier._id,
          partyModel: 'Supplier',
          entryType: 'Purchase',
          debit: 0,
          credit: amount,
          balance: balance,
          date: getRandomDate(new Date(2023, 0, 1), new Date()),
          description: `Purchase from ${supplier.name}`,
          notes: 'Fabric purchase transaction',
          createdBy: admin._id
        });
        
        ledgerEntries.push(entry);
      }
      
      // Add some payment entries
      for (let i = 0; i < getRandomNumber(1, 5); i++) {
        const amount = getRandomDecimal(2000, 20000);
        balance -= amount;
        
        const entry = await LedgerEntry.create({
          partyType: 'Supplier',
          partyId: supplier._id,
          partyModel: 'Supplier',
          entryType: 'Payment',
          debit: amount,
          credit: 0,
          balance: balance,
          date: getRandomDate(new Date(2023, 0, 1), new Date()),
          description: `Payment to ${supplier.name}`,
          notes: 'Supplier payment',
          createdBy: admin._id
        });
        
        ledgerEntries.push(entry);
      }
    }

    console.log('✅ Ledger Entries seeded');
    return ledgerEntries;
  } catch (error) {
    console.error('❌ Error seeding ledger entries:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();
    
    console.log('🌱 Starting database seeding...');
    
    // Seed in order (respecting dependencies)
    const { admin } = await getExistingAdmin();
    const locations = await seedLocations(admin);
    const suppliers = await seedSuppliers(admin);
    const employees = await seedEmployees(admin);
    const products = await seedProducts(admin, suppliers);
    const inventoryRolls = await seedInventoryRolls(admin, products, suppliers, locations);
    const customers = await seedCustomers(admin);
    const sales = await seedPosSales(customers, employees, products, inventoryRolls);
    const invoices = await seedInvoices(admin, customers);
    const purchaseOrders = await seedPurchaseOrders(admin, suppliers, products);
    const payrolls = await seedPayroll(admin, employees);
    const ledgerEntries = await seedLedgerEntries(admin, customers, suppliers, employees, sales, invoices);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`👤 Admins: 1`);
    console.log(`🏭 Suppliers: ${suppliers.length}`);
    console.log(`👥 Employees: ${employees.length}`);
    console.log(`🧵 Products: ${products.length}`);
    console.log(`📦 Inventory Rolls: ${inventoryRolls.length}`);
    console.log(`👥 Customers: ${customers.length}`);
    console.log(`💰 POS Sales: ${sales.length}`);
    console.log(`📄 Invoices: ${invoices.length}`);
    console.log(`📋 Purchase Orders: ${purchaseOrders.length}`);
    console.log(`💼 Payroll Records: ${payrolls.length}`);
    console.log(`📊 Ledger Entries: ${ledgerEntries.length}`);
    console.log(`📍 Locations: ${locations.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Email: admin@binsultan.com');
    console.log('Password: admin123 (if using default auth)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
