const isAdmin = (req, res, next) => {
  try {
    if (req.admin && req.admin.role === 'admin') {
      return next();
    }
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Admin access required'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Permission check failed'
    });
  }
};

const isStaff = (req, res, next) => {
  try {
    if (req.admin && (req.admin.role === 'admin' || req.admin.role === 'staff')) {
      return next();
    }
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Staff access required'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Permission check failed'
    });
  }
};

const isAuthenticated = (req, res, next) => {
  try {
    if (req.admin) {
      return next();
    }
    return res.status(401).json({
      success: false,
      result: null,
      message: 'Authentication required'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Authentication check failed'
    });
  }
};

module.exports = {
  isAdmin,
  isStaff,
  isAuthenticated
};
