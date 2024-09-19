const AppError = require('../utils/appError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    return next(
      new AppError(
        error.details.map((detail) => detail.message).join(', '),
        400,
      ),
    );
  }

  return next();
};

module.exports = validate;
