const bookService = require('../services/book.service');
const asyncHandler = require('../utils/asyncHandler');

exports.createBook = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body);
  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: { book }
  });
});

exports.updateBook = asyncHandler(async (req, res) => {
  const book = await bookService.updateBook(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: { book }
  });
});

exports.deleteBook = asyncHandler(async (req, res) => {
  const result = await bookService.deleteBook(req.params.id);
  res.status(200).json({
    success: true,
    ...result
  });
});

exports.getBook = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(req.params.id);
  res.status(200).json({
    success: true,
    data: { book }
  });
});

exports.listBooks = asyncHandler(async (req, res) => {
  const result = await bookService.listBooks(req.query);
  res.status(200).json({
    success: true,
    data: result
  });
});