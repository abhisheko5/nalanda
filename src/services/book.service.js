const Book = require('../models/Book.model');
const ApiError = require('../utils/ApiError');

class BookService {
  async createBook(bookData) {
    const existingBook = await Book.findOne({ isbn: bookData.isbn });
    if (existingBook) {
      throw new ApiError('Book with this ISBN already exists', 400);
    }
    const book = await Book.create(bookData);
    return book;
  }

  async updateBook(bookId, updateData) {
    const book = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!book) {
      throw new ApiError('Book not found', 404);
    }
    return book;
  }

  async deleteBook(bookId) {
    const book = await Book.findByIdAndUpdate(
      bookId,
      { isActive: false },
      { new: true }
    );
    if (!book) {
      throw new ApiError('Book not found', 404);
    }
    return { message: 'Book deleted successfully' };
  }

  async getBookById(bookId) {
    const book = await Book.findOne({ _id: bookId, isActive: true });
    if (!book) {
      throw new ApiError('Book not found', 404);
    }
    return book;
  }

  async listBooks(query) {
    const { page = 1, limit = 10, genre, author, search, sortBy = 'createdAt', order = 'desc' } = query;
    
    const filter = { isActive: true };
    
    if (genre) filter.genre = new RegExp(genre, 'i');
    if (author) filter.author = new RegExp(author, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') },
        { genre: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Book.countDocuments(filter)
    ]);

    return {
      books,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    };
  }
}

module.exports = new BookService();