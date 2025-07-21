const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json() // Log as JSON for better structure
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log only errors
    new transports.File({ filename: 'logs/combined.log' }) // Log all levels
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(format.colorize(), format.simple())
  }));
}

module.exports = logger;
