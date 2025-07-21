const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  console.error('🛑 Error captured in middleware:', err.message); // Debug log

  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

  res.status(err.statusCode || 500).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
