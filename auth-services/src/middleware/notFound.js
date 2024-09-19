const logger = require('../config/logger');

const notFound = (req, res /* next */) => {
  logger.warn(`404 Not Found - ${req.method} ${req.originalUrl} - ${req.ip}`);
  res.status(404).json({
    status: 'Failure',
    statusCode: 404,
    message: 'Route not found',
  });
};

module.exports = notFound;
