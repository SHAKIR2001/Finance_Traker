const Goal = require('../models/Goal');

// @desc   Create a new goal
// @route  POST /api/goals
// @access Private (User Only)
const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline, autoSave, contributionAmount, saveFrequency } = req.body;

    if (!name || !targetAmount || !deadline) {
      return res.status(400).json({ message: 'Please provide name, targetAmount, and deadline.' });
    }

    // Ensure saveFrequency is properly set
    if (!['daily', 'weekly', 'monthly'].includes(saveFrequency)) {
      return res.status(400).json({ message: 'Invalid saveFrequency value. Must be daily, weekly, or monthly.' });
    }

    const goal = await Goal.create({
      user: req.user._id,
      name,
      targetAmount,
      deadline,
      autoSave: autoSave || false,
      contributionAmount: contributionAmount || 0,
      saveFrequency, // Store the value as provided, without a default
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// @desc   Get all goals for the logged-in user
// @route  GET /api/goals
// @access Private (User Only)
const getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Update a goal
// @route  PUT /api/goals/:id
// @access Private (User Only)
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this goal' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Delete a goal
// @route  DELETE /api/goals/:id
// @access Private (User Only)
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this goal' });
    }

    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createGoal, getUserGoals, updateGoal, deleteGoal };
