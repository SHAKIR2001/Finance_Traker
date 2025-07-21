const Category = require('../models/Category');

// @desc   Create a new category (Admin Only)
// @route  POST /api/categories
// @access Private (Admin Only)
const createCategory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can add categories.' });
    }

    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Category name and type are required.' });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    const category = await Category.create({ name, type });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get all categories (Available to Users)
// @route  GET /api/categories
// @access Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Delete a category (Admin Only)
// @route  DELETE /api/categories/:id
// @access Private (Admin Only)
const deleteCategory = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete categories.' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCategory, getCategories, deleteCategory };
