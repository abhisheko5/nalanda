const borrowService = require('../services/borrow.service');
const asyncHandler = require('../utils/asyncHandler');

exports.borrowBook = asyncHandler(async (req, res) => {
  const borrow = await borrowService.borrowBook(req.user._id, req.body.bookId);
  res.status(201).json({
    success: true,
    message: 'Book borrowed successfully',
    data: { borrow }
  });
});

exports.returnBook = asyncHandler(async (req, res) => {
  const borrow = await borrowService.returnBook(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: 'Book returned successfully',
    data: { borrow }
  });
});

exports.getBorrowHistory = asyncHandler(async (req, res) => {
  const result = await borrowService.getBorrowHistory(req.user._id, req.query);
  res.status(200).json({
    success: true,
    data: result
  });
});

exports.getAllBorrows = asyncHandler(async (req, res) => {
  const result = await borrowService.getAllBorrows(req.query);
  res.status(200).json({
    success: true,
    data: result
  });
});