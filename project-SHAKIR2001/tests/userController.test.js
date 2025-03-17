const { registerUser } = require('../controllers/userController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../models/User'); // Mock User Model
jest.mock('jsonwebtoken'); // Mock JWT
jest.mock('bcryptjs'); // Mock Password Hashing

describe('User Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should register a new user', async () => {
    const mockReq = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'securepassword',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock password hashing
    bcrypt.hash.mockResolvedValue('hashedpassword');

    // Mock user creation
    User.findOne.mockResolvedValue(null); // No existing user
    User.create.mockResolvedValue({
      _id: 'mockUserId',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    });

    // Mock JWT token
    jwt.sign.mockReturnValue('mockToken');

    await registerUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'mockUserId',
      name: 'Test User',
      email: 'test@example.com',
      token: 'mockToken',
    }));
  });

  it('should not register if user already exists', async () => {
    const mockReq = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'securepassword',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue({ email: 'test@example.com' }); // Mock existing user

    await registerUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });
});
