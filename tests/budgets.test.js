const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Make sure your server.js exports app
const User = require('../models/User');
const Category = require('../models/Category');
const Budget = require('../models/Budget');

let token;
let categoryId;

beforeAll(async () => {
  const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/finance-tracker-test';
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Register user
  const userRes = await request(app)
    .post('/api/users/register')
    .send({
      name: 'Budget Tester',
      email: 'budgetuser@example.com',
      password: 'password123',
    });

  token = userRes.body.token;

  // Create category for budget
  const categoryRes = await request(app)
    .post('/api/categories')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Entertainment',
    });

  categoryId = categoryRes.body._id;
});

afterAll(async () => {
  await User.deleteMany({ email: 'budgetuser@example.com' }); // Delete only test user
  await Category.deleteMany({ name: 'Entertainment' }); // Delete only test category
  await Budget.deleteMany({ amount: 2000 }); // Delete only test budgets
  await mongoose.connection.close();
});


describe('Budget API Integration Tests', () => {
  it('should create a new budget', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category: categoryId,
        amount: 2000,
        period: 'monthly',
        startDate: '2025-03-01',
        endDate: '2025-12-31',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('amount', 2000);
    expect(res.body).toHaveProperty('category', categoryId);
  });

  it('should fetch all budgets for user', async () => {
    const res = await request(app)
      .get('/api/budgets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return error when missing required fields', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 1000,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Please provide category and amount.');
  });
});
