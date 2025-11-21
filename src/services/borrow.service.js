const Borrow = require('../models/Borrow.model');
const Book = require('../models/Book.model');
const ApiError = require('../utils/ApiError');

class BorrowService {
  async borrowBook(userId, bookId) {
    const book = await Book.findOne({ _id: bookId, isActive: true });
    if (!book) {
      throw new ApiError('Book not found', 404);
    }
    if (book.availableCopies <= 0) {
      throw new ApiError('No copies available for borrowing', 400);
    }

    // Check if user already has this book borrowed
    const existingBorrow = await Borrow.findOne({
      user: userId,
      book: bookId,
      status: 'borrowed'
    });
    if (existingBorrow) {
      throw new ApiError('You already have this book borrowed', 400);
    }

    // Create borrow record (14 days due date)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrow = await Borrow.create({
      user: userId,
      book: bookId,
      dueDate
    });

    // Decrement available copies
    await Book.findByIdAndUpdate(bookId, {
      $inc: { availableCopies: -1 }
    });

    return await borrow.populate('book', 'title author isbn');
  }

  async returnBook(userId, borrowId) {
    const borrow = await Borrow.findOne({
      _id: borrowId,
      user: userId,
      status: 'borrowed'
    });

    if (!borrow) {
      throw new ApiError('Borrow record not found or already returned', 404);
    }

    borrow.returnDate = new Date();
    borrow.status = 'returned';
    await borrow.save();

    // Increment available copies
    await Book.findByIdAndUpdate(borrow.book, {
      $inc: { availableCopies: 1 }
    });

    return await borrow.populate('book', 'title author isbn');
  }

  async getBorrowHistory(userId, query) {
    const { page = 1, limit = 10, status } = query;
    const filter = { user: userId };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [borrows, total] = await Promise.all([
      Borrow.find(filter)
        .populate('book', 'title author isbn genre')
        .sort({ borrowDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Borrow.countDocuments(filter)
    ]);

    return {
      borrows,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    };
  }

  async getAllBorrows(query) {
    const { page = 1, limit = 10, status } = query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [borrows, total] = await Promise.all([
      Borrow.find(filter)
        .populate('user', 'name email')
        .populate('book', 'title author isbn')
        .sort({ borrowDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Borrow.countDocuments(filter)
    ]);

    return {
      borrows,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    };
  }
}

module.exports = new BorrowService();