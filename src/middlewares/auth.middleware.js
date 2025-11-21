const { verifyToken } = require('../utils/jwt');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Protect routes - require authentication
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new ApiError('Not authorized, no token provided', 401);
  }
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new ApiError('User not found or inactive', 401);
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError('Not authorized, token invalid', 401);
  }
});

// Restrict to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError('You do not have permission for this action', 403);
    }
    next();
  };
};

// Admin only middleware
const adminOnly = restrictTo('admin');

// Member only middleware
const memberOnly = restrictTo('member');

module.exports = { protect, restrictTo, adminOnly, memberOnly };