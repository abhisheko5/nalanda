const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { 
  createBookValidator, 
  updateBookValidator, 
  mongoIdValidator,
  paginationValidator 
} = require('../validators');

// GET /api/books - List all books (all authenticated users)
router.get('/', protect, paginationValidator, validate, bookController.listBooks);

// GET /api/books/:id - Get single book
router.get('/:id', protect, mongoIdValidator, validate, bookController.getBook);

// POST /api/books - Add new book (admin only)
router.post('/', protect, adminOnly, createBookValidator, validate, bookController.createBook);

// PUT /api/books/:id - Update book (admin only)
router.put('/:id', protect, adminOnly, updateBookValidator, validate, bookController.updateBook);

// DELETE /api/books/:id - Delete book (admin only)
router.delete('/:id', protect, adminOnly, mongoIdValidator, validate, bookController.deleteBook);

module.exports = router;