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
  // if (error) {
  //   return next(new AppError(error.details[0].message, 400));
  // }
  next();
};

module.exports = validate;
