const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const config = {
  PORT: process.env.PORT || 5000,
  HTTPS_PORT: process.env.HTTPS_PORT || 443,
  HOST: process.env.HOST || 'orLocalHost',
  MONGO_URL: process.env.MONGO_URL,
  GOOGLE_JWT_SECRET: process.env.GOOGLE_JWT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  GOOGLE_CLIENT_ID: process.env.CLIENT_ID,
  GOOGLE_Client_SECRET: process.env.CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.CALLBACK_URL,
};

module.exports = config;
