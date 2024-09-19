const jwt = require('jsonwebtoken');
// const User = require('../model/authModel');
const config = require('../config/config');
const Apperror = require('../utils/appError');
const logger = require('../config/logger');

// const requireAuth = (req, res, next) => {
//   const token = req.header('Authorization') || req.query.token;
//   if (!token) {
//     logger.warn(
//       `Authorization denied. No token provided - ${req.method} ${req.originalUrl} - ${req.ip}`,
//     );
//     return next(new Apperror('No token, authorization denied', 401));
//   }
//   try {
//     const decoded = jwt.verify(token.split(' ')[1], config.JWT_SECRET);
//     req.user = decoded.userId;
//     logger.info(
//       `User authenticated - UserID: ${decoded.userId} - ${req.method} ${req.originalUrl} - ${req.ip}`,
//     );
//     next();
//   } catch (err) {
//     logger.error(
//       `Invalid token - ${req.method} ${req.originalUrl} - ${req.ip}`,
//     );
//     return next(new Apperror('Token is not valid', 401));
//   }
// };

const requireAuth = (req, res, next) => {
  if (req.path === '/favicon.ico') {
    return res.status(204).end(); // No content response for favicon requests
  }
  let token = req.header('Authorization');

  if (token) {
    // Check if token is in the format "Bearer <token>"
    token = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
  } else {
    // Check for token in query parameters
    token = req.query.token;
  }

  if (!token) {
    logger.warn(
      `Authorization denied. No token provided - ${req.method} ${req.originalUrl} - ${req.ip}`,
    );
    return next(new Apperror('No token, authorization denied', 401));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.userId;
    logger.info(
      `User authenticated - UserID: ${decoded.userId} - ${req.method} ${req.originalUrl} - ${req.ip}`,
    );
    next();
  } catch (err) {
    logger.error(
      `Invalid token - ${req.method} ${req.originalUrl} - ${req.ip}`,
    );
    return next(new Apperror('Token is not valid', 401));
  }
};

module.exports = requireAuth;
