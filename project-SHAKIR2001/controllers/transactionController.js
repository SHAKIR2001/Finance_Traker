const Budget = require('../models/Budget'); 
const axios = require('axios');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category'); // Import Category Model



// Function to fetch exchange rates (Base Currency: LKR)
const getExchangeRate = async (currency) => {
  try {
    if (currency === 'LKR') return 1; // No conversion needed for LKR

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
    return response.data.rates["LKR"] || 1; // Convert TO LKR
  } catch (error) {
    console.error("❌ Error fetching exchange rate:", error);
    return 1; // Default to 1 in case of failure
  }
};

// @desc   Create a new transaction (with currency conversion)
// @route  POST /api/transactions
// @access Private (User Only)
const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, date, description, tags, currency, recurring, endDate } = req.body;

    if (!type || !amount || !category) {
      return next(new Error('Please provide all required fields.'));
    }

    // Check if category exists
    const categoryExists = await Category.findOne({ name: category });
    const budgetExists = await Budget.findOne({ user: req.user._id, category: category });

    if (!categoryExists && !budgetExists) {
      return next(new Error('Invalid category. Please select a valid one.'));
    }
    const categoryId = categoryExists ? categoryExists._id : budgetExists.category; 


    // Get exchange rate and convert amount to LKR
    const exchangeRate = await getExchangeRate(currency || 'LKR');
    const convertedAmount = amount * exchangeRate;

    // Create transaction with converted amount
    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      currency: currency || 'LKR',
      convertedAmount, // Store converted amount in LKR
      category: categoryId,
      date,
      description,
      tags: tags || [],
      recurring: recurring || 'none',    
      endDate: endDate || null        
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error); // Pass errors to middleware
  }
};

// @desc   Get transactions with filters (including tags)
// @route  GET /api/transactions
// @access Private (User Only)
const getUserTransactions = async (req, res) => {
  try {
    console.log("Received Query Params:", req.query); // Log the entire query object

    const { type, category, startDate, endDate, tags } = req.query;

    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category) {
      // Find the category by name and filter using its ObjectId
      const categoryExists = await Category.findOne({ name: category });
      if (categoryExists) {
        filter.category = categoryExists._id;
      } else {
        return res.status(400).json({ message: 'Invalid category filter.' });
      }
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    

    console.log("Final Filter Applied:", JSON.stringify(filter, null, 2));

    const transactions = await Transaction.find(filter) .populate('category', 'name').sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Update a transaction
// @route  PUT /api/transactions/:id
// @access Private (User Only)
const updateTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description, tags } = req.body;

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this transaction' });
    }

    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;

    if (category) {
      // Find category by name and update ObjectId
      const categoryExists = await Category.findOne({ name: category });
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category. Please select a valid one.' });
      }
      transaction.category = categoryExists._id;
    }

    transaction.date = date || transaction.date;
    transaction.description = description || transaction.description;
    transaction.tags = tags || transaction.tags;

    const updatedTransaction = await transaction.save();
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Delete a transaction
// @route  DELETE /api/transactions/:id
// @access Private (User Only)
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this transaction' });
    }

    await Transaction.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get all transactions (Admin Only)
// @route  GET /api/transactions/admin
// @access Private (Admin Only)
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email').populate('category', 'name')    // ✅ Now also populates category name.sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });  
  }
};

// @desc   Delete any transaction (Admin Only)
// @route  DELETE /api/transactions/admin/:id
// @access Private (Admin Only)
const deleteAnyTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTransaction,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  deleteAnyTransaction
};
