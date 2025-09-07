const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../src/models/appModels/Product');

mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/erp-crm')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const count = await Product.countDocuments();
    console.log(`📊 Total products in database: ${count}`);
    
    const products = await Product.find({}).select('name fabricType category').limit(15);
    console.log('\n📋 First 15 products:');
    products.forEach((p, i) => console.log(`${i+1}. ${p.name} (${p.fabricType}) - ${p.category}`));
    
    // Check if there are any products with specific categories
    const categories = await Product.distinct('category');
    console.log('\n🏷️  Product categories:');
    categories.forEach(cat => console.log(`   • ${cat}`));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
