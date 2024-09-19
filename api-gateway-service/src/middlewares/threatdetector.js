const { validationResult, check } = require('express-validator');

const validateSearchParams = [
  check('search')
    .optional()
    .isAlphanumeric()
    .withMessage('Search term must be alphanumeric'),
];

const threatDetection = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'failure',
      statusCode: 400,
      message: 'Initial validation error',
      errors: errors.array(),
    });
  }
  return next();
};

module.exports = { threatDetection, validateSearchParams };
