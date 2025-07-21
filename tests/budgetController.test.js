const { setBudget } = require('../controllers/budgetController');
const Budget = require('../models/Budget');

jest.mock('../models/Budget'); // Mock Budget Model

describe('Budget Creation', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('should create a new budget', async () => {
    const mockReq = {
      user: { _id: 'mockUserId' },
      body: {
        category: 'Food',
        amount: 1000,
        period: 'monthly',
        startDate: '2025-03-01',
        endDate: '2025-12-31',
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockNext = jest.fn();

    // ✅ Properly mock Budget.create() instead of prototype.save()
    Budget.create.mockResolvedValue({
      _id: 'mockBudgetId',
      user: 'mockUserId',
      category: 'Food',
      amount: 1000,
      period: 'monthly',
      startDate: '2025-03-01T00:00:00.000Z',
      endDate: '2025-12-31T00:00:00.000Z',
    });

    await setBudget(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'mockBudgetId',
      user: 'mockUserId',
      category: 'Food',
      amount: 1000,
      period: 'monthly',
      startDate: '2025-03-01T00:00:00.000Z',
      endDate: '2025-12-31T00:00:00.000Z',
    }));
  });

  it('should return an error if required fields are missing', async () => {
    const mockReq = {
      user: { _id: 'mockUserId' },
      body: {
        category: '', // Missing category
        amount: '',    // Missing amount
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockNext = jest.fn();

    await setBudget(mockReq, mockRes, mockNext);

    // ✅ Check if next() was called with an error
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
