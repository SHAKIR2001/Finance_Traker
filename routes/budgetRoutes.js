const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  setBudget,
  getUserBudgets,
  updateBudget,
  deleteBudget,
  checkBudgetAlerts
} = require('../controllers/budgetController');

const router = express.Router();

// Set a budget
router.post('/', protect, setBudget);

// Get user budgets
router.get('/', protect, getUserBudgets);

// Update a budget
router.put('/:id', protect, updateBudget);

// Delete a budget
router.delete('/:id', protect, deleteBudget);

// Check for budget alerts
router.get('/alerts', protect, checkBudgetAlerts);

module.exports = router;
