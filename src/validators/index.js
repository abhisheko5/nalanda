const { body, param, query } = require('express-validator');

// Auth validators
exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Role must be admin or member')
];

exports.loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Book validators
exports.createBookValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('publicationDate').isISO8601().withMessage('Valid publication date is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('totalCopies').isInt({ min: 1 }).withMessage('Total copies must be at least 1')
];

exports.updateBookValidator = [
  param('id').isMongoId().withMessage('Invalid book ID'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
  body('totalCopies').optional().isInt({ min: 0 }).withMessage('Copies must be non-negative')
];

// Borrow validators
exports.borrowBookValidator = [
  body('bookId').isMongoId().withMessage('Invalid book ID')
];

exports.returnBookValidator = [
  param('id').isMongoId().withMessage('Invalid borrow record ID')
];

// Common validators
exports.mongoIdValidator = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

exports.paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
];