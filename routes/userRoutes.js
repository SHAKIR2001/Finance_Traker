const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser, // Import the deleteUser controller
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Import express-validator
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Register Route with validation
router.post(
  '/register',
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    registerUser(req, res);
  }
);

// Login Route with validation
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    loginUser(req, res);
  }
);

// Protected Route (Accessible only to logged-in users)
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'User profile', user: req.user });
});

// Admin Route (Accessible only to admin users)
router.get('/admin', protect, isAdmin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Admin Route to get all users (Accessible only to admin users)
router.get('/all-users', protect, isAdmin, getAllUsers);

// Admin Route to delete a user (Accessible only to admin users)
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;
