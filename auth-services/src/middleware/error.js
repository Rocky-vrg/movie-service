const logger = require('../config/logger');
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log('error middleware reached', err); // eslint-disable-line no-console

  logger.error(
    `Error: ${err.message} - Status: ${err.statusCode || 500} - ${req.method} ${req.originalUrl} - ${req.ip}- Stack${err.stack}`,
  );
  const errorResponse = {
    status: err.status || 'error',
    statusCode: err.statusCode || 500,
    message: err.message,
  };

  res.status(errorResponse.statusCode).json({
    status: errorResponse.status,
    statusCode: errorResponse.statusCode,
    message: errorResponse.message,
  });
};

module.exports = errorHandler;
