const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');

const router = express.Router();

// Create a new goal
router.post('/', protect, createGoal);

// Get all goals for a user
router.get('/', protect, getUserGoals);

// Update a goal
router.put('/:id', protect, updateGoal);

// Delete a goal
router.delete('/:id', protect, deleteGoal);

module.exports = router;
