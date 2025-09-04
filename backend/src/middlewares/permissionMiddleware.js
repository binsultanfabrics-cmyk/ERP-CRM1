const Role = require('@/models/appModels/Role');
const Permission = require('@/models/appModels/Permission');
const AuditLog = require('@/models/appModels/AuditLog');

// Cache for permissions to avoid repeated DB queries
const permissionCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Get user permissions from cache or database
      let userPermissions = permissionCache.get(userId);
      
      if (!userPermissions || Date.now() - userPermissions.timestamp > CACHE_TTL) {
        // Fetch user role and permissions
        const user = await require('@/models/coreModels/Admin').findById(userId).populate('role');
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'User not found',
          });
        }

        // Get permissions based on system role or custom role
        let permissions = [];
        
        if (user.systemRole === 'owner') {
          // Owner has all permissions
          permissions = await Permission.find({ enabled: true }).select('name');
          permissions = permissions.map(p => p.name);
        } else if (user.role) {
          // Custom role permissions
          const role = await Role.findById(user.role).populate('permissions');
          permissions = role.permissions || [];
        } else {
          // Default permissions based on system role
          permissions = getDefaultPermissions(user.systemRole);
        }

        // Cache permissions
        permissionCache.set(userId, {
          permissions,
          timestamp: Date.now(),
        });
        
        userPermissions = { permissions };
      }

      // Check if user has required permission
      if (!userPermissions.permissions.includes(requiredPermission)) {
        // Log unauthorized access attempt
        await AuditLog.create({
          action: 'UNAUTHORIZED_ACCESS',
          entity: 'Permission',
          entityId: userId,
          userId,
          userEmail: req.user.email,
          description: `Unauthorized access attempt to ${requiredPermission}`,
          severity: 'HIGH',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        });

        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          required: requiredPermission,
        });
      }

      // Add permissions to request for use in controllers
      req.userPermissions = userPermissions.permissions;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
      });
    }
  };
};

// Helper function to get default permissions based on system role
const getDefaultPermissions = (systemRole) => {
  const defaultPermissions = {
    admin: [
      'POS.sell',
      'POS.discount.approve',
      'Inventory.view',
      'Inventory.adjust',
      'Ledger.view',
      'Ledger.pay',
      'Reports.view',
      'Reports.export',
      'Payroll.view',
      'Purchase.view',
      'Purchase.create',
      'Settings.view',
    ],
    manager: [
      'POS.sell',
      'POS.discount.approve',
      'Inventory.view',
      'Inventory.adjust',
      'Ledger.view',
      'Reports.view',
      'Payroll.view',
      'Purchase.view',
    ],
    cashier: [
      'POS.sell',
      'Inventory.view',
      'Ledger.view',
    ],
  };

  return defaultPermissions[systemRole] || [];
};

// Middleware to log critical actions
const logAction = (action, entity, severity = 'MEDIUM') => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        AuditLog.create({
          action,
          entity,
          entityId: req.params.id || req.body.id,
          userId: req.user?.id,
          userEmail: req.user?.email,
          changes: {
            before: req.body.before,
            after: req.body.after,
          },
          description: `${action} ${entity}`,
          severity,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
          },
        }).catch(err => console.error('Audit log error:', err));
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Clear permission cache for a user (call this when user role changes)
const clearUserPermissionCache = (userId) => {
  permissionCache.delete(userId);
};

// Clear all permission cache
const clearAllPermissionCache = () => {
  permissionCache.clear();
};

module.exports = {
  checkPermission,
  logAction,
  clearUserPermissionCache,
  clearAllPermissionCache,
  getDefaultPermissions,
};
