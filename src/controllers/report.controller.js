const reportService = require('../services/report.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getMostBorrowedBooks = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const result = await reportService.getMostBorrowedBooks(limit);
  res.status(200).json({
    success: true,
    data: { mostBorrowedBooks: result }
  });
});

exports.getActiveMembers = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const result = await reportService.getActiveMembers(limit);
  res.status(200).json({
    success: true,
    data: { activeMembers: result }
  });
});

exports.getBookAvailability = asyncHandler(async (req, res) => {
  const result = await reportService.getBookAvailability();
  res.status(200).json({
    success: true,
    data: result
  });
});