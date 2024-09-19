// const Joi = require('joi');

const validateId = (value, helpers) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(value);

  const isnumber = /^\d+$/.test(value);

  if (!isObjectId && !isnumber) {
    return helpers.error('any.invalid', { label: 'validateId' });
  }

  return value;
};

module.exports = { validateId };
