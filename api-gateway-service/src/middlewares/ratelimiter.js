const rateLimit = require('express-rate-limit');

const customLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many requests! Please wait a moment and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = customLimiter;
