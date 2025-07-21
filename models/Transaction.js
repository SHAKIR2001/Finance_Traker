const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.Mixed, required: true }, 
    tags: { type: [String], default: [] },
    date: { type: Date, default: Date.now },
    description: { type: String },
    recurring: { type: String, enum: ['daily', 'weekly', 'monthly', 'none'], default: 'none' },
    endDate: { type: Date, default: null },
    currency: { type: String, default: 'LKR' },
    convertedAmount: { type: Number },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
