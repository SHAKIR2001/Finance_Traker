const Transaction = require('../models/Transaction');

// @desc   Generate a financial report
// @route  GET /api/reports
// @access Private (User Only)
const generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get category-wise spending summary
// @route  GET /api/reports/category-summary
// @access Private (User Only)
const getCategorySummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense' } },
      { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } }
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get income vs expense summary
// @route  GET /api/reports/income-vs-expense
// @access Private (User Only)
const getIncomeVsExpense = async (req, res) => {
  try {
    const income = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'income' } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
    ]);

    const expense = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense' } },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
    ]);

    res.status(200).json({
      totalIncome: income.length > 0 ? income[0].totalIncome : 0,
      totalExpense: expense.length > 0 ? expense[0].totalExpense : 0,
      balance: (income.length > 0 ? income[0].totalIncome : 0) - (expense.length > 0 ? expense[0].totalExpense : 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { generateReport, getCategorySummary, getIncomeVsExpense };
