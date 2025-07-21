const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Unique category name
    type: { type: String, enum: ['income', 'expense'], required: true }, // Specify if it's for income or expense
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
