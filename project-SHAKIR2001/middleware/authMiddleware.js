// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT and authenticate user
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // Move to next middleware/controller
  } catch (error) {
    console.error('JWT Auth Error:', error);
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
};

// Middleware to authorize admin-only access
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Allow access
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

module.exports = { protect, isAdmin };
