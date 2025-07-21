const express = require('express');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { getAdminDashboard, getUserDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/admin', protect, isAdmin, getAdminDashboard); // Admin Dashboard
router.get('/user', protect, getUserDashboard); // User Dashboard

module.exports = router;
