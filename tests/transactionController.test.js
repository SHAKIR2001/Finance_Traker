const { createTransaction } = require('../controllers/transactionController');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category'); // Mock Category Model

jest.mock('../models/Transaction'); // Mock the Transaction model
jest.mock('../models/Category'); // Mock the Category model

describe('Create Transaction', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('should create a new transaction', async () => {
    const mockReq = {
      user: { _id: 'user123' },
      body: {
        type: 'expense',
        amount: 500,
        category: 'Food',
        description: 'Lunch',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn(); // Mock next() for error handling

    // Mock category check (ensures Food is a valid category)
    Category.findOne.mockResolvedValue({ _id: 'mockCategoryId', name: 'Food' });

    // Mock transaction creation
    Transaction.create.mockResolvedValue({
      ...mockReq.body,
      user: mockReq.user._id,
      _id: 'mockTransactionId',
      category: 'mockCategoryId',
    });

    await createTransaction(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      type: 'expense',
      amount: 500,
      category: 'mockCategoryId',
    }));
  });

  it('should return an error for an invalid category', async () => {
    const mockReq = {
      user: { _id: 'user123' },
      body: {
        type: 'expense',
        amount: 500,
        category: 'InvalidCategory',
        description: 'Dinner',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn(); // Mock next() for error handling

    // Mock category check to return null (invalid category)
    Category.findOne.mockResolvedValue(null);

    await createTransaction(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error)); // Ensure error is passed to middleware
  });
});
