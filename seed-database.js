#!/usr/bin/env node

/**
 * Database Seeding Script for Bin Sultan ERP-CRM
 * 
 * This script provides an easy way to seed the database with Pakistani cloth shop data.
 * Run this from the root directory of the project.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🌱 Bin Sultan ERP-CRM Database Seeding');
console.log('=====================================\n');

// Check if we're in the right directory
const packageJsonPath = path.join(__dirname, 'backend', 'package.json');
try {
  require(packageJsonPath);
} catch (error) {
  console.error('❌ Error: Please run this script from the root directory of the project');
  console.error('   Expected to find: backend/package.json');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const isQuick = args.includes('--quick') || args.includes('-q');
const isHelp = args.includes('--help') || args.includes('-h');

if (isHelp) {
  console.log('Usage: node seed-database.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --quick, -q    Run quick seed (smaller dataset)');
  console.log('  --help, -h     Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node seed-database.js          # Full seed');
  console.log('  node seed-database.js --quick  # Quick seed');
  console.log('');
  console.log('Note: Make sure MongoDB is running and your .env file is configured.');
  process.exit(0);
}

const scriptName = isQuick ? 'quickSeed.js' : 'seedData.js';
const scriptPath = path.join(__dirname, 'backend', 'scripts', scriptName);

console.log(`📋 Running ${isQuick ? 'Quick' : 'Full'} Database Seed...`);
console.log(`📁 Script: ${scriptPath}`);
console.log('');

// Change to backend directory and run the script
const child = spawn('node', [scriptPath], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n🚀 You can now start the application:');
    console.log('   Frontend: cd frontend && npm run dev');
    console.log('   Backend:  cd backend && npm run dev');
    console.log('\n🔑 Login with: admin@binsultan.com / admin123');
  } else {
    console.log(`\n❌ Database seeding failed with exit code ${code}`);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Check your .env file for correct DATABASE connection');
    console.log('   3. Ensure all dependencies are installed: npm install');
    console.log('   4. Check the error messages above for specific issues');
  }
});

child.on('error', (error) => {
  console.error(`\n❌ Failed to start seeding script: ${error.message}`);
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Make sure you have Node.js installed');
  console.log('   2. Run npm install in the backend directory');
  console.log('   3. Check file permissions');
});
