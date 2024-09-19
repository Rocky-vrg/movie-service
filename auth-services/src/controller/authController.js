const jwt = require('jsonwebtoken');
const authService = require('../services/authservice');
const AppError = require('../utils/appError');

const config = require('../config/config');
// const verifyToken = require('../middleware/tokenverify');

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '100d' });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '365d',
  });
};

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userExists = await authService.findUserByEmail(email);
    if (userExists) {
      return next(new AppError('User already exists', 400));
    }

    const user = await authService.createUser(email, password);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.status(201).json({
      status: 'success',
      statusCode: 201,
      message: 'Successfully signed-up',
      data: { AccessToken: accessToken, RefreshToken: refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await authService.findUserByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Successfully signed-in',
      data: { AccessToken: accessToken, RefreshToken: refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

const signUsingRefreshToken = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new AppError('Refresh token is required', 401));
  }
  try {
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(decoded.userId);
    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Successfully created AccesToken using Refresh token',
      data: { AccessToken: newAccessToken },
    });
  } catch (error) {
    return next(new AppError('Invalid refresh token', 401));
  }
};
/* eslint-disable camelcase */
const protected_route = (req, res) => {
  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message: 'Welcome to the protected route ',
    user: req.user,
  });
};

const google_auth_user = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({
      status: 'failure',
      statusCode: 401,
      message: 'Unauthorized: No token provided',
    });
  }

  jwt.verify(token, config.GOOGLE_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'failure',
        statusCode: 403,
        message: 'Forbidden: Invalid token',
      });
    }

    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: `Hello ${req.user.displayName} , Google authenticated user - You have access to the protected route`,
      user,
      token,
    });
  });
};

const failure_route = (req, res) => {
  return res.send('Hello your google authentiction failed');
};

const gog_auth = (req, res) => {
  return res.send(
    '<a href="https://localhost:443/api/v1/auth/google">authenticate with google</a>',
  );
};

module.exports = {
  signin,
  signup,
  signUsingRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  protected_route,
  google_auth_user,
  failure_route,
  gog_auth,
};
