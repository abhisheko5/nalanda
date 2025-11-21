const Borrow = require('../models/Borrow.model');
const Book = require('../models/Book.model');
const User = require('../models/User.model');

class ReportService {
  async getMostBorrowedBooks(limit = 10) {
    const result = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          borrowCount: { $sum: 1 }
        }
      },
      { $sort: { borrowCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          _id: 1,
          borrowCount: 1,
          title: '$bookDetails.title',
          author: '$bookDetails.author',
          isbn: '$bookDetails.isbn',
          genre: '$bookDetails.genre'
        }
      }
    ]);
    return result;
  }

  async getActiveMembers(limit = 10) {
    const result = await Borrow.aggregate([
      {
        $group: {
          _id: '$user',
          totalBorrows: { $sum: 1 },
          currentlyBorrowed: {
            $sum: { $cond: [{ $eq: ['$status', 'borrowed'] }, 1, 0] }
          }
        }
      },
      { $sort: { totalBorrows: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          totalBorrows: 1,
          currentlyBorrowed: 1,
          name: '$userDetails.name',
          email: '$userDetails.email'
        }
      }
    ]);
    return result;
  }

  async getBookAvailability() {
    const [bookStats, borrowStats] = await Promise.all([
      Book.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalBooks: { $sum: 1 },
            totalCopies: { $sum: '$totalCopies' },
            availableCopies: { $sum: '$availableCopies' }
          }
        }
      ]),
      Borrow.aggregate([
        { $match: { status: 'borrowed' } },
        {
          $group: {
            _id: null,
            currentlyBorrowed: { $sum: 1 }
          }
        }
      ])
    ]);

    const stats = bookStats[0] || { totalBooks: 0, totalCopies: 0, availableCopies: 0 };
    const borrowed = borrowStats[0]?.currentlyBorrowed || 0;

    // Genre breakdown
    const genreBreakdown = await Book.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
          totalCopies: { $sum: '$totalCopies' },
          available: { $sum: '$availableCopies' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return {
      summary: {
        totalUniqueBooks: stats.totalBooks,
        totalCopies: stats.totalCopies,
        availableCopies: stats.availableCopies,
        borrowedCopies: stats.totalCopies - stats.availableCopies,
        currentActiveBorrows: borrowed
      },
      genreBreakdown
    };
  }
}

module.exports = new ReportService();