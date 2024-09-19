const User = require('../model/authModel');

const findUserByEmail = async (email) => {
  // eslint-disable-next-line no-return-await
  return await User.findOne({ email });
};
const createUser = async (email, password) => {
  const user = new User({ email, password });
  // eslint-disable-next-line no-return-await
  return await user.save();
};

module.exports = { findUserByEmail, createUser };
