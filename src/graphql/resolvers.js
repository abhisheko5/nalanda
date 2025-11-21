const User = require('../models/User.model');
const Book = require('../models/Book.model');
const Borrow = require('../models/Borrow.model');
const authService = require('../services/auth.service');
const bookService = require('../services/book.service');
const borrowService = require('../services/borrow.service');
const reportService = require('../services/report.service');
const userService = require('../services/user.service');
const { GraphQLError } = require('graphql');

const checkAuth = (ctx) => {
  if (!ctx.user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
  return ctx.user;
};

const checkAdmin = (ctx) => {
  const user = checkAuth(ctx);
  if (user.role !== 'admin') throw new GraphQLError('Admin access required', { extensions: { code: 'FORBIDDEN' } });
  return user;
};

const resolvers = {
  Query: {
    me: async (_, __, ctx) => {
      const user = checkAuth(ctx);
      return await User.findById(user.id);
    },

    books: async (_, args, ctx) => {
      checkAuth(ctx);
      const result = await bookService.listBooks(args);
      return { books: result.books, total: result.pagination.total, page: result.pagination.current, pages: result.pagination.pages };
    },

    book: async (_, { id }, ctx) => {
      checkAuth(ctx);
      return await bookService.getBookById(id);
    },

    myBorrowHistory: async (_, args, ctx) => {
      const user = checkAuth(ctx);
      const result = await borrowService.getBorrowHistory(user.id, args);
      return { borrows: result.borrows, total: result.pagination.total, page: result.pagination.current, pages: result.pagination.pages };
    },

    allBorrows: async (_, args, ctx) => {
      checkAdmin(ctx);
      const result = await borrowService.getAllBorrows(args);
      return { borrows: result.borrows, total: result.pagination.total, page: result.pagination.current, pages: result.pagination.pages };
    },

    mostBorrowedBooks: async (_, { limit }, ctx) => {
      checkAdmin(ctx);
      const result = await reportService.getMostBorrowedBooks(limit);
      return result.map(r => ({ id: r._id, title: r.title, author: r.author, isbn: r.isbn, genre: r.genre, borrowCount: r.borrowCount }));
    },

    activeMembers: async (_, { limit }, ctx) => {
      checkAdmin(ctx);
      const result = await reportService.getActiveMembers(limit);
      return result.map(r => ({ id: r._id, name: r.name, email: r.email, totalBorrows: r.totalBorrows, currentlyBorrowed: r.currentlyBorrowed }));
    },

    bookAvailability: async (_, __, ctx) => {
      checkAdmin(ctx);
      const result = await reportService.getBookAvailability();
      return { summary: result.summary, genreBreakdown: result.genreBreakdown.map(g => ({ genre: g._id, count: g.count, totalCopies: g.totalCopies, available: g.available })) };
    },

    users: async (_, args, ctx) => {
      checkAdmin(ctx);
      const result = await userService.getAllUsers(args);
      return result.users;
    },

    user: async (_, { id }, ctx) => {
      checkAdmin(ctx);
      return await userService.getUserById(id);
    }
  },

  Mutation: {
    register: async (_, args) => {
      return await authService.register(args);
    },

    login: async (_, { email, password }) => {
      return await authService.login(email, password);
    },

    createBook: async (_, args, ctx) => {
      checkAdmin(ctx);
      return await bookService.createBook(args);
    },

    updateBook: async (_, { id, ...data }, ctx) => {
      checkAdmin(ctx);
      return await bookService.updateBook(id, data);
    },

    deleteBook: async (_, { id }, ctx) => {
      checkAdmin(ctx);
      await bookService.deleteBook(id);
      return await Book.findById(id);
    },

    borrowBook: async (_, { bookId }, ctx) => {
      const user = checkAuth(ctx);
      return await borrowService.borrowBook(user.id, bookId);
    },

    returnBook: async (_, { borrowId }, ctx) => {
      const user = checkAuth(ctx);
      return await borrowService.returnBook(user.id, borrowId);
    },

    updateUser: async (_, { id, ...data }, ctx) => {
      checkAdmin(ctx);
      return await userService.updateUser(id, data);
    },

    deleteUser: async (_, { id }, ctx) => {
      checkAdmin(ctx);
      await userService.deleteUser(id);
      return await User.findById(id);
    }
  },

  Borrow: {
    user: async (borrow) => borrow.user._id ? borrow.user : await User.findById(borrow.user),
    book: async (borrow) => borrow.book._id ? borrow.book : await Book.findById(borrow.book)
  }
};

module.exports = resolvers;