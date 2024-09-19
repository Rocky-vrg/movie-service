// const mockingoose = require('mockingoose');
const jwt = require('jsonwebtoken');
// const authModel = require('../src/model/authModel');

jest.mock('jsonwebtoken');
const controller = require('../src/controller/authController');
const AppError = require('../src/utils/appError');
const authService = require('../src/services/authservice');

describe('Test Auth Controller', () => {
  it('should return error if user already exists', async () => {
    const req = {
      body: {
        email: 'existing@example.com',
        password: 'password123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    // Mock the authService.findUserByEmail to return an existing user
    jest.spyOn(authService, 'findUserByEmail').mockResolvedValue(true);

    await controller.signup(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0]).toMatchObject({
      message: 'User already exists',
      statusCode: 400,
    });
  });

  it('should successfully sign up a new user', async () => {
    const req = {
      body: {
        email: 'newuser@example.com',
        password: 'password123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    jest.spyOn(authService, 'findUserByEmail').mockResolvedValue(null);

    jest.spyOn(authService, 'createUser').mockResolvedValue({
      _id: 'user123',
      email: 'newuser@example.com',
    });

    await controller.signup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        statusCode: 201,
        message: 'Successfully signed-up',
        data: expect.any(Object),
      }),
    );
  });

  it('should return error if invalid email or password', async () => {
    const req = {
      body: {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    jest.spyOn(authService, 'findUserByEmail').mockResolvedValue(null);

    await controller.signin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0]).toMatchObject({
      message: 'Invalid email or password',
      statusCode: 401,
    });
  });

  it('should successfully sign in the user', async () => {
    const req = {
      body: {
        email: 'user@example.com',
        password: 'correctpassword',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const mockUser = {
      _id: 'user123',
      email: 'user@example.com',
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    // Mock the authService.findUserByEmail to return a user
    jest.spyOn(authService, 'findUserByEmail').mockResolvedValue(mockUser);

    await controller.signin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        statusCode: 200,
        message: 'Successfully signed-in',
        data: expect.any(Object),
      }),
    );
  });
  it('should return error if refresh token is invalid', async () => {
    const req = {
      body: {
        token: 'invalidToken',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    // Mock JWT verification to throw an error
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid refresh token');
    });

    await controller.signUsingRefreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0]).toMatchObject({
      message: 'Invalid refresh token',
      statusCode: 401,
    });
  });
  it('should create a new access token with valid refresh token', async () => {
    const req = {
      body: {
        token: 'validRefreshToken',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    // Mock JWT verification to return a decoded token
    jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'user123' });

    await controller.signUsingRefreshToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        statusCode: 200,
        message: 'Successfully created AccesToken using Refresh token',
        data: expect.any(Object),
      }),
    );
  });
});
