const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows the googleId field to be optional
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required() {
      return !this.googleId;
    },
    minlength: 6,
  },
  accessToken: String,
  refreshToken: String,
  displayName: { type: String },
});

authSchema.pre('save', async function noName(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

authSchema.methods.comparePassword = async function compareName(password) {
  // eslint-disable-next-line no-return-await
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('Auth', authSchema);
module.exports = User;
