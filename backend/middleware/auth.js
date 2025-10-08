const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Access denied. Invalid user.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Access denied. Invalid token.' });
  }
};

// Middleware to check if user needs password change
const checkPasswordChange = async (req, res, next) => {
  try {
    // Skip password change check for password change endpoint itself
    if (req.path === '/api/auth/change-password') {
      return next();
    }

    if (req.user && req.user.tempPassword) {
      return res.status(403).json({
        message: 'Password change required',
        requirePasswordChange: true,
        user: {
          id: req.user._id,
          email: req.user.email,
          name: `${req.user.firstName} ${req.user.lastName}`,
          role: req.user.role
        }
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error during password check.' });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

// Middleware to check if user has specific permission
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Superadmin has all permissions
    if (req.user.role === 'superadmin') {
      return next();
    }

    if (!req.user.permissions || !req.user.permissions[permission]) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

// Middleware to check if user can access specific resource
const requireResourceAccess = (resourceType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Superadmin has access to all resources
    if (req.user.role === 'superadmin') {
      return next();
    }

    const permissionMap = {
      student: {
        create: 'canCreateStudent',
        edit: 'canEditStudent',
        delete: 'canDeleteStudent',
        view: 'canViewProgress'
      },
      teacher: {
        create: 'canCreateTeacher',
        edit: 'canEditTeacher',
        delete: 'canDeleteTeacher',
        view: 'canViewProgress'
      },
      course: {
        create: 'canCreateCourse',
        edit: 'canEditCourse',
        delete: 'canDeleteCourse',
        view: 'canViewProgress'
      }
    };

    const method = req.method.toLowerCase();
    let action = 'view';

    if (method === 'post') action = 'create';
    else if (method === 'put' || method === 'patch') action = 'edit';
    else if (method === 'delete') action = 'delete';

    const requiredPermission = permissionMap[resourceType]?.[action];

    if (requiredPermission && (!req.user.permissions || !req.user.permissions[requiredPermission])) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

// Combined middleware for admin access (admin or superadmin)
const requireAdmin = requireRole(['admin', 'superadmin']);

// Combined middleware for superadmin only
const requireSuperAdmin = requireRole(['superadmin']);

module.exports = {
  verifyToken,
  checkPasswordChange,
  requireRole,
  requirePermission,
  requireResourceAccess,
  requireAdmin,
  requireSuperAdmin
};