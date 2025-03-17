const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');

// @desc   Get Admin Dashboard Data
// @route  GET /api/dashboard/admin
// @access Private (Admin Only)
const getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalIncome = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      totalUsers,
      totalTransactions,
      totalIncome: totalIncome.length > 0 ? totalIncome[0].total : 0,
      totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get User Dashboard Data
// @route  GET /api/dashboard/user
// @access Private (User Only)
const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalIncome = await Transaction.aggregate([
      { $match: { user: userId, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = await Transaction.aggregate([
      { $match: { user: userId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const userBudgets = await Budget.find({ user: userId });
    const userGoals = await Goal.find({ user: userId });

    res.status(200).json({
      totalIncome: totalIncome.length > 0 ? totalIncome[0].total : 0,
      totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
      budgets: userBudgets,
      goals: userGoals
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAdminDashboard, getUserDashboard };
