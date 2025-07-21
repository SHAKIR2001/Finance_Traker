const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  generateReport,
  getCategorySummary,
  getIncomeVsExpense,
} = require('../controllers/reportController');

const router = express.Router();

// Generate a full financial report
router.get('/', protect, generateReport);

// Get category-wise spending summary
router.get('/category-summary', protect, getCategorySummary);

// Get income vs. expense comparison
router.get('/income-vs-expense', protect, getIncomeVsExpense);

module.exports = router;
