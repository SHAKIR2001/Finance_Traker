// models/Goal.js

const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    autoSave: { type: Boolean, default: false },
    contributionAmount: { type: Number, default: 0 },
    saveFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true // Ensure saveFrequency is required and not defaulting to 'monthly'
    },
    lastAutoSave: { type: Date }, // Track last save date
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
