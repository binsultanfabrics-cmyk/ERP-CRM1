const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const Admin = require('../src/models/coreModels/Admin');
const Product = require('../src/models/appModels/Product');
const InventoryRoll = require('../src/models/appModels/InventoryRoll');
const Supplier = require('../src/models/appModels/Supplier');
const Location = require('../src/models/appModels/Location');

// Additional 30 diverse products for Pakistani cloth shop
const additionalProducts = [
  // Premium & Luxury Fabrics
  { name: 'Mulmul Cotton', fabricType: 'Cotton', category: 'Premium Summer' },
  { name: 'Khaddar Cotton', fabricType: 'Cotton', category: 'Traditional Premium' },
  { name: 'Jamawar Silk', fabricType: 'Silk', category: 'Luxury Traditional' },
  { name: 'Banarasi Silk', fabricType: 'Silk', category: 'Bridal Luxury' },
  { name: 'Kashmiri Pashmina', fabricType: 'Wool', category: 'Luxury Winter' },
  { name: 'Angora Wool', fabricType: 'Wool', category: 'Premium Winter' },
  
  // Seasonal Specialties
  { name: 'Monsoon Cotton', fabricType: 'Cotton', category: 'Rainy Season' },
  { name: 'Summer Chiffon', fabricType: 'Silk', category: 'Summer Formal' },
  { name: 'Winter Flannel', fabricType: 'Wool', category: 'Winter Casual' },
  { name: 'Spring Organza', fabricType: 'Silk', category: 'Spring Party' },
  
  // Traditional Pakistani Fabrics
  { name: 'Ajrak Print', fabricType: 'Cotton', category: 'Sindhi Traditional' },
  { name: 'Phulkari Fabric', fabricType: 'Cotton', category: 'Punjabi Traditional' },
  { name: 'Balochi Embroidery', fabricType: 'Cotton', category: 'Balochi Traditional' },
  { name: 'Kashmiri Shawl Fabric', fabricType: 'Wool', category: 'Kashmiri Traditional' },
  { name: 'Peshawari Chappal Material', fabricType: 'Other', category: 'Footwear' },
  
  // Modern & Contemporary
  { name: 'Stretch Denim', fabricType: 'Denim', category: 'Modern Casual' },
  { name: 'Athletic Jersey', fabricType: 'Polyester', category: 'Sports Wear' },
  { name: 'Performance Fabric', fabricType: 'Polyester', category: 'Active Wear' },
  { name: 'Moisture Wicking', fabricType: 'Polyester', category: 'Sports Wear' },
  
  // Home & Interior
  { name: 'Upholstery Fabric', fabricType: 'Cotton', category: 'Furniture' },
  { name: 'Outdoor Canvas', fabricType: 'Cotton', category: 'Outdoor Furniture' },
  { name: 'Blackout Curtains', fabricType: 'Polyester', category: 'Window Treatment' },
  { name: 'Sheer Curtains', fabricType: 'Polyester', category: 'Window Treatment' },
  { name: 'Rug Backing', fabricType: 'Cotton', category: 'Flooring' },
  
  // Specialized Fabrics
  { name: 'Fire Retardant', fabricType: 'Polyester', category: 'Safety Wear' },
  { name: 'Waterproof Fabric', fabricType: 'Polyester', category: 'Outdoor Gear' },
  { name: 'Insulation Material', fabricType: 'Wool', category: 'Construction' },
  { name: 'Medical Grade Cotton', fabricType: 'Cotton', category: 'Medical' },
  { name: 'Food Grade Fabric', fabricType: 'Cotton', category: 'Food Industry' }
];

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

// Get existing admin
const getExistingAdmin = async () => {
  try {
    const admin = await Admin.findOne({ email: 'admin@binsultan.com' });
    if (!admin) {
      throw new Error('Admin not found. Please run the main seeding script first.');
    }
    return admin;
  } catch (error) {
    console.error('❌ Error getting admin:', error);
    throw error;
  }
};

// Add new products
const addNewProducts = async (admin) => {
  try {
    console.log('🧵 Adding 30 new diverse products...');
    
    // Get existing suppliers and locations
    const suppliers = await Supplier.find({});
    const locations = await Location.find({});
    
    if (suppliers.length === 0) {
      throw new Error('No suppliers found. Please run the main seeding script first.');
    }
    if (locations.length === 0) {
      throw new Error('No locations found. Please run the main seeding script first.');
    }
    
    const newProducts = [];
    let productCounter = await Product.countDocuments() + 1;
    
    for (const productData of additionalProducts) {
      const color = getRandomElement(['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Grey', 'Maroon', 'Navy', 'Sky Blue', 'Cream', 'Beige', 'Gold', 'Silver']);
      const supplier = getRandomElement(suppliers);
      
      // Different pricing based on fabric type
      let costPrice, minSalePrice, maxSalePrice;
      
      switch (productData.fabricType) {
        case 'Silk':
          costPrice = getRandomDecimal(800, 3000);
          minSalePrice = costPrice * 1.4;
          maxSalePrice = costPrice * 2.5;
          break;
        case 'Wool':
          costPrice = getRandomDecimal(600, 2500);
          minSalePrice = costPrice * 1.3;
          maxSalePrice = costPrice * 2.2;
          break;
        case 'Other':
          costPrice = getRandomDecimal(1000, 4000);
          minSalePrice = costPrice * 1.5;
          maxSalePrice = costPrice * 2.8;
          break;
        case 'Cotton':
          costPrice = getRandomDecimal(200, 1200);
          minSalePrice = costPrice * 1.2;
          maxSalePrice = costPrice * 2.0;
          break;
        default: // Polyester, Denim, Linen, Velvet
          costPrice = getRandomDecimal(300, 1500);
          minSalePrice = costPrice * 1.3;
          maxSalePrice = costPrice * 2.1;
      }
      
      const product = await Product.create({
        code: `FAB-${String(productCounter).padStart(3, '0')}`,
        name: `${productData.name} - ${color}`,
        fabricType: productData.fabricType,
        color: color,
        size: 'Standard',
        description: `Premium quality ${productData.fabricType.toLowerCase()} fabric in ${color.toLowerCase()} color. Perfect for ${productData.category.toLowerCase()}.`,
        images: [`/images/products/fabric-${productCounter}.jpg`],
        pricing: {
          minSalePrice: minSalePrice,
          maxSalePrice: maxSalePrice,
          costPrice: costPrice,
          defaultPrice: (minSalePrice + maxSalePrice) / 2,
          defaultUnit: 'm'
        },
        totalStock: 0, // Will be updated when inventory rolls are created
        minStockLevel: getRandomNumber(5, 15),
        supplier: supplier._id,
        createdBy: admin._id
      });
      
      newProducts.push(product);
      productCounter++;
    }
    
    console.log(`✅ Added ${newProducts.length} new products`);
    return newProducts;
  } catch (error) {
    console.error('❌ Error adding products:', error);
    throw error;
  }
};

// Add inventory rolls for new products
const addInventoryRolls = async (admin, newProducts, suppliers, locations) => {
  try {
    console.log('📦 Adding inventory rolls for new products...');
    
    const inventoryRolls = [];
    let rollCounter = await InventoryRoll.countDocuments() + 1;
    
    for (const product of newProducts) {
      // Create 2-6 rolls per product
      const rollCount = getRandomNumber(2, 6);
      
      for (let i = 0; i < rollCount; i++) {
        const initLength = getRandomDecimal(30, 150);
        const remainingLength = getRandomDecimal(5, initLength);
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
          receivedAt: getRandomDate(new Date(2023, 6, 1), new Date()),
          location: location._id,
          locationName: location.name,
          notes: `New stock added for ${product.name}`,
          createdBy: admin._id
        });
        
        inventoryRolls.push(roll);
        rollCounter++;
      }
      
      // Update product total stock
      const totalStock = inventoryRolls
        .filter(roll => roll.product.equals(product._id))
        .reduce((sum, roll) => sum + roll.remainingLength, 0);
      
      await Product.findByIdAndUpdate(product._id, { totalStock: totalStock });
    }
    
    console.log(`✅ Added ${inventoryRolls.length} inventory rolls`);
    return inventoryRolls;
  } catch (error) {
    console.error('❌ Error adding inventory rolls:', error);
    throw error;
  }
};

// Main function
const addMoreProducts = async () => {
  try {
    console.log('🚀 Starting additional products seeding...');
    console.log('📋 This script will add 30 new diverse products to your inventory');
    
    await connectDB();
    
    const admin = await getExistingAdmin();
    const suppliers = await Supplier.find({});
    const locations = await Location.find({});
    
    const newProducts = await addNewProducts(admin);
    const newInventoryRolls = await addInventoryRolls(admin, newProducts, suppliers, locations);
    
    console.log('\n🎉 Additional products seeding completed successfully!');
    console.log('\n📊 New Data Summary:');
    console.log(`🧵 New Products Added: ${newProducts.length}`);
    console.log(`📦 New Inventory Rolls: ${newInventoryRolls.length}`);
    
    console.log('\n📋 New Product Categories:');
    const categories = [...new Set(newProducts.map(p => p.description.split(' ').slice(-2).join(' ')))];
    categories.forEach(category => {
      const count = newProducts.filter(p => p.description.includes(category)).length;
      console.log(`   • ${category}: ${count} products`);
    });
    
    console.log('\n🔑 Login Credentials (unchanged):');
    console.log('Email: admin@binsultan.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in additional products seeding:', error);
    process.exit(1);
  }
};

// Run the script
addMoreProducts();
