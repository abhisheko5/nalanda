const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrow.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { 
  borrowBookValidator, 
  returnBookValidator,
  paginationValidator 
} = require('../validators');

// POST /api/borrow - Borrow a book (members)
router.post('/', protect, borrowBookValidator, validate, borrowController.borrowBook);

// PUT /api/borrow/:id/return - Return a borrowed book
router.put('/:id/return', protect, returnBookValidator, validate, borrowController.returnBook);

// GET /api/borrow/history - Get user's borrow history
router.get('/history', protect, paginationValidator, validate, borrowController.getBorrowHistory);

// GET /api/borrow/all - Get all borrows (admin only)
router.get('/all', protect, adminOnly, paginationValidator, validate, borrowController.getAllBorrows);

module.exports = router;