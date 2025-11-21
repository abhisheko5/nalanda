const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// All report routes are admin only

// GET /api/reports/most-borrowed - Most borrowed books report
router.get('/most-borrowed', protect, adminOnly, reportController.getMostBorrowedBooks);

// GET /api/reports/active-members - Most active members report
router.get('/active-members', protect, adminOnly, reportController.getActiveMembers);

// GET /api/reports/availability - Book availability summary
router.get('/availability', protect, adminOnly, reportController.getBookAvailability);

module.exports = router;