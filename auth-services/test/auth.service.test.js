const mockingoose = require('mockingoose');
const authModel = require('../src/model/authModel');
const authService = require('../src/services/authservice');

describe('Auth Service', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should find a user by email', async () => {
    const mockUser = {
      _id: '608c1f1bfc13ae6b25000001',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    mockingoose(authModel).toReturn(mockUser, 'findOne');

    const user = await authService.findUserByEmail('test@example.com');

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  it('should create a new user with hashed password', async () => {
    const email = 'newuser@example.com';
    const password = 'plaintextpassword';

    const mockUser = {
      email,
      password: 'hashedpassword',
    };

    mockingoose(authModel).toReturn(mockUser, 'save');

    const savedUser = await authService.createUser(email, password);

    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe(email);
    expect(savedUser.password).not.toBe(password);
  });
});
