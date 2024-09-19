const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const config = {
  PORT: process.env.MOVIE_PORT,
  HOST: process.env.HOST || 'orLocalHost',
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  GOOGLE_JWT_SECRET: process.env.GOOGLE_JWT_SECRET,
};

module.exports = config;
