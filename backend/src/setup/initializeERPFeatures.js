const mongoose = require('mongoose');
const Role = require('@/models/appModels/Role');
const Permission = require('@/models/appModels/Permission');
const Location = require('@/models/appModels/Location');
const Admin = require('@/models/coreModels/Admin');

// Default permissions for the ERP system
const defaultPermissions = [
  // POS Module
  { name: 'POS.sell', description: 'Process sales transactions', module: 'POS', action: 'create', resource: 'sale' },
  { name: 'POS.discount.approve', description: 'Approve discounts and bargains', module: 'POS', action: 'approve', resource: 'discount' },
  { name: 'POS.return', description: 'Process returns and refunds', module: 'POS', action: 'create', resource: 'return' },
  { name: 'POS.view', description: 'View POS transactions', module: 'POS', action: 'read', resource: 'transaction' },

  // Inventory Module
  { name: 'Inventory.view', description: 'View inventory items', module: 'Inventory', action: 'read', resource: 'inventory' },
  { name: 'Inventory.adjust', description: 'Adjust stock levels', module: 'Inventory', action: 'update', resource: 'stock' },
  { name: 'Inventory.transfer', description: 'Transfer stock between locations', module: 'Inventory', action: 'update', resource: 'transfer' },
  { name: 'Inventory.receive', description: 'Receive purchase orders', module: 'Inventory', action: 'create', resource: 'receipt' },

  // Ledger Module
  { name: 'Ledger.view', description: 'View ledger entries', module: 'Ledger', action: 'read', resource: 'ledger' },
  { name: 'Ledger.pay', description: 'Record payments', module: 'Ledger', action: 'create', resource: 'payment' },
  { name: 'Ledger.adjust', description: 'Adjust ledger entries', module: 'Ledger', action: 'update', resource: 'adjustment' },

  // Reports Module
  { name: 'Reports.view', description: 'View reports', module: 'Reports', action: 'read', resource: 'report' },
  { name: 'Reports.export', description: 'Export reports', module: 'Reports', action: 'export', resource: 'report' },

  // Payroll Module
  { name: 'Payroll.view', description: 'View payroll information', module: 'Payroll', action: 'read', resource: 'payroll' },
  { name: 'Payroll.run', description: 'Run payroll calculations', module: 'Payroll', action: 'run', resource: 'payroll' },

  // Purchase Module
  { name: 'Purchase.view', description: 'View purchase orders', module: 'Purchase', action: 'read', resource: 'purchase' },
  { name: 'Purchase.create', description: 'Create purchase orders', module: 'Purchase', action: 'create', resource: 'purchase' },
  { name: 'Purchase.approve', description: 'Approve purchase orders', module: 'Purchase', action: 'approve', resource: 'purchase' },

  // Settings Module
  { name: 'Settings.view', description: 'View system settings', module: 'Settings', action: 'read', resource: 'settings' },
  { name: 'Settings.update', description: 'Update system settings', module: 'Settings', action: 'update', resource: 'settings' },

  // Admin Module
  { name: 'Admin.users', description: 'Manage users and roles', module: 'Admin', action: 'update', resource: 'users' },
  { name: 'Admin.audit', description: 'View audit logs', module: 'Admin', action: 'read', resource: 'audit' },
];

// Default roles
const defaultRoles = [
  {
    name: 'Owner',
    description: 'Full system access with all permissions',
    permissions: defaultPermissions.map(p => p.name),
    isSystemRole: true,
  },
  {
    name: 'Manager',
    description: 'Management level access with most permissions',
    permissions: [
      'POS.sell', 'POS.discount.approve', 'POS.return', 'POS.view',
      'Inventory.view', 'Inventory.adjust', 'Inventory.transfer', 'Inventory.receive',
      'Ledger.view', 'Ledger.pay', 'Ledger.adjust',
      'Reports.view', 'Reports.export',
      'Payroll.view', 'Payroll.run',
      'Purchase.view', 'Purchase.create', 'Purchase.approve',
      'Settings.view',
    ],
    isSystemRole: true,
  },
  {
    name: 'Cashier',
    description: 'Point of sale and basic inventory access',
    permissions: [
      'POS.sell', 'POS.view',
      'Inventory.view',
      'Ledger.view',
    ],
    isSystemRole: true,
  },
  {
    name: 'Inventory Manager',
    description: 'Inventory and purchase management',
    permissions: [
      'Inventory.view', 'Inventory.adjust', 'Inventory.transfer', 'Inventory.receive',
      'Purchase.view', 'Purchase.create', 'Purchase.approve',
      'Reports.view',
    ],
    isSystemRole: true,
  },
];

// Default location
const defaultLocation = {
  code: 'MAIN',
  name: 'Main Store',
  type: 'Store',
  address: {
    street: 'Main Street',
    city: 'Karachi',
    state: 'Sindh',
    country: 'Pakistan',
  },
  contact: {
    phone: '+92-21-1234567',
    email: 'main@binsultan.com',
    manager: 'Store Manager',
  },
  capacity: {
    maxRolls: 1000,
    maxValue: 0,
  },
  settings: {
    allowNegativeStock: false,
    requireApprovalForTransfer: true,
    autoReorder: false,
    reorderLevel: 10,
  },
  isDefault: true,
  notes: 'Main store location for Bin Sultan Cloth Shop',
};

const initializeERPFeatures = async () => {
  try {
    console.log('🚀 Initializing ERP features...');

    // Create default permissions
    console.log('📝 Creating default permissions...');
    for (const permissionData of defaultPermissions) {
      const existingPermission = await Permission.findOne({ name: permissionData.name });
      if (!existingPermission) {
        const permission = new Permission({
          ...permissionData,
          isSystemPermission: true,
        });
        await permission.save();
        console.log(`✅ Created permission: ${permissionData.name}`);
      } else {
        console.log(`⚠️  Permission already exists: ${permissionData.name}`);
      }
    }

    // Create default roles
    console.log('👥 Creating default roles...');
    for (const roleData of defaultRoles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        const role = new Role({
          ...roleData,
          createdBy: null, // Will be set to first admin user
        });
        await role.save();
        console.log(`✅ Created role: ${roleData.name}`);
      } else {
        console.log(`⚠️  Role already exists: ${roleData.name}`);
      }
    }

    // Create default location
    console.log('🏢 Creating default location...');
    const existingLocation = await Location.findOne({ code: defaultLocation.code });
    if (!existingLocation) {
      const location = new Location({
        ...defaultLocation,
        createdBy: null, // Will be set to first admin user
      });
      await location.save();
      console.log(`✅ Created location: ${defaultLocation.name}`);
    } else {
      console.log(`⚠️  Location already exists: ${defaultLocation.name}`);
    }

    // Assign owner role to first admin user
    console.log('👤 Assigning owner role to admin users...');
    const ownerRole = await Role.findOne({ name: 'Owner' });
    if (ownerRole) {
      const adminUsers = await Admin.find({ role: { $exists: false } });
      for (const admin of adminUsers) {
        admin.role = ownerRole._id;
        admin.systemRole = 'owner';
        await admin.save();
        console.log(`✅ Assigned owner role to: ${admin.email}`);
      }
    }

    console.log('🎉 ERP features initialization completed successfully!');
    
    return {
      success: true,
      message: 'ERP features initialized successfully',
      data: {
        permissions: defaultPermissions.length,
        roles: defaultRoles.length,
        location: 1,
      },
    };
  } catch (error) {
    console.error('❌ Error initializing ERP features:', error);
    return {
      success: false,
      message: 'Failed to initialize ERP features',
      error: error.message,
    };
  }
};

// Function to reset all ERP features (for development)
const resetERPFeatures = async () => {
  try {
    console.log('🔄 Resetting ERP features...');

    // Delete all non-system roles
    await Role.deleteMany({ isSystemRole: false });
    console.log('✅ Deleted custom roles');

    // Delete all non-system permissions
    await Permission.deleteMany({ isSystemPermission: false });
    console.log('✅ Deleted custom permissions');

    // Delete all locations except default
    await Location.deleteMany({ isDefault: false });
    console.log('✅ Deleted non-default locations');

    // Reset admin roles
    await Admin.updateMany({}, { $unset: { role: 1 } });
    console.log('✅ Reset admin roles');

    console.log('🎉 ERP features reset completed!');
    
    return {
      success: true,
      message: 'ERP features reset successfully',
    };
  } catch (error) {
    console.error('❌ Error resetting ERP features:', error);
    return {
      success: false,
      message: 'Failed to reset ERP features',
      error: error.message,
    };
  }
};

module.exports = {
  initializeERPFeatures,
  resetERPFeatures,
  defaultPermissions,
  defaultRoles,
  defaultLocation,
};
