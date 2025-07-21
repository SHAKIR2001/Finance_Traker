const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc   Set a new budget
// @route  POST /api/budgets
// @access Private (User Only)
const setBudget = async (req, res) => {
  try {
    const { category, amount, period, startDate, endDate } = req.body;

    if (!category || !amount) {
      return res.status(400).json({ message: 'Please provide category and amount.' });
    }

    const budget = new Budget({
      user: req.user._id,
      category,
      amount,
      period: period || 'monthly',
      startDate: startDate || new Date(),
      endDate: endDate || null,
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get all budgets for the logged-in user
// @route  GET /api/budgets
// @access Private (User Only)
const getUserBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Update a budget
// @route  PUT /api/budgets/:id
// @access Private (User Only)
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this budget' });
    }

    Object.assign(budget, req.body);
    const updatedBudget = await budget.save();

    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Delete a budget
// @route  DELETE /api/budgets/:id
// @access Private (User Only)
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this budget' });
    }

    await Budget.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// @desc   Check if spending exceeds budget or unusual spending occurs
// @route  GET /api/budgets/alerts
// @access Private (User Only)
const checkBudgetAlerts = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    let alerts = [];

    for (const budget of budgets) {
      console.log(`Checking budget for category: ${budget.category}`);

      // Get total spending in this category
      const totalSpent = await Transaction.aggregate([
        { $match: { user: req.user._id, category: budget.category, type: 'expense' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      const spentAmount = totalSpent.length > 0 ? totalSpent[0].total : 0;

      // 🚨 Budget Exceeded Alert
      if (spentAmount >= budget.amount) {
        alerts.push({
          category: budget.category,
          type: "budget_exceeded",
          message: `You have exceeded your ${budget.period} budget for ${budget.category}.`
        });
      } else if (spentAmount >= budget.amount * 0.8) {
        alerts.push({
          category: budget.category,
          type: "budget_warning",
          message: `Warning! You have used 80% of your ${budget.period} budget for ${budget.category}.`
        });
      }

      // 🚨 Unusual Spending Alert
      const pastTransactions = await Transaction.aggregate([
        { $match: { user: req.user._id, category: budget.category, type: 'expense' } },
        { $group: { _id: "$category", avgSpent: { $avg: "$amount" }, maxSpent: { $max: "$amount" } } }
      ]);

      if (pastTransactions.length > 0) {
        const avgSpent = pastTransactions[0].avgSpent || 0;
        const maxSpent = pastTransactions[0].maxSpent || 0;

        if (spentAmount > avgSpent * 2) {
          alerts.push({
            category: budget.category,
            type: "unusual_spending",
            message: `Unusual spending detected! You spent more than twice your average in ${budget.category}.`
          });
        } else if (spentAmount > maxSpent * 1.5) {
          alerts.push({
            category: budget.category,
            type: "spending_spike",
            message: `Spending spike detected! Your latest spending in ${budget.category} is unusually high.`
          });
        }
      }
    }

    console.log("Final Alerts:", alerts);
    res.status(200).json(alerts);
  } catch (error) {
    console.error("Error in budget alerts:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};





module.exports = { setBudget, getUserBudgets, updateBudget, deleteBudget, checkBudgetAlerts };
