const express = require('express');
const router = express.Router();
  
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  createTransaction,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  deleteAnyTransaction,
} = require('../controllers/transactionController');


// Create a new transaction
router.post('/', protect, createTransaction);

// Get all transactions for logged-in user
router.get('/', protect, getUserTransactions);

// Update a transaction
router.put('/:id', protect, updateTransaction);        

// Delete a transaction
router.delete('/:id', protect, deleteTransaction);

// Admin: Get all transactions
router.get('/admin', protect, isAdmin, getAllTransactions);

// Admin: Delete any transaction
router.delete('/admin/:id', protect, isAdmin, deleteAnyTransaction);

module.exports = router;
