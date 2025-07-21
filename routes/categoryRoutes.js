const express = require('express');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { createCategory, getCategories, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

router.post('/', protect, isAdmin, createCategory); // Admins add categories
router.get('/', getCategories); // Users can view categories
router.delete('/:id', protect, isAdmin, deleteCategory); // Admins delete categories

module.exports = router;
