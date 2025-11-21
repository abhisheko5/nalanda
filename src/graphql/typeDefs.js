const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    isbn: String!
    publicationDate: String!
    genre: String!
    totalCopies: Int!
    availableCopies: Int!
    description: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Borrow {
    id: ID!
    user: User!
    book: Book!
    borrowDate: String!
    dueDate: String!
    returnDate: String
    status: String!
    createdAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type BookList {
    books: [Book!]!
    total: Int!
    page: Int!
    pages: Int!
  }

  type BorrowList {
    borrows: [Borrow!]!
    total: Int!
    page: Int!
    pages: Int!
  }

  type MostBorrowedBook {
    id: ID!
    title: String!
    author: String!
    isbn: String!
    genre: String!
    borrowCount: Int!
  }

  type ActiveMember {
    id: ID!
    name: String!
    email: String!
    totalBorrows: Int!
    currentlyBorrowed: Int!
  }

  type AvailabilitySummary {
    totalUniqueBooks: Int!
    totalCopies: Int!
    availableCopies: Int!
    borrowedCopies: Int!
    currentActiveBorrows: Int!
  }

  type GenreBreakdown {
    genre: String!
    count: Int!
    totalCopies: Int!
    available: Int!
  }

  type BookAvailability {
    summary: AvailabilitySummary!
    genreBreakdown: [GenreBreakdown!]!
  }

  type Query {
    # Auth
    me: User

    # Books
    books(page: Int, limit: Int, genre: String, author: String, search: String): BookList!
    book(id: ID!): Book

    # Borrows
    myBorrowHistory(page: Int, limit: Int, status: String): BorrowList!
    allBorrows(page: Int, limit: Int, status: String): BorrowList!

    # Reports (Admin)
    mostBorrowedBooks(limit: Int): [MostBorrowedBook!]!
    activeMembers(limit: Int): [ActiveMember!]!
    bookAvailability: BookAvailability!

    # Users (Admin)
    users(page: Int, limit: Int, role: String, search: String): [User!]!
    user(id: ID!): User
  }

  type Mutation {
    # Auth
    register(name: String!, email: String!, password: String!, role: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    # Books (Admin)
    createBook(
      title: String!
      author: String!
      isbn: String!
      publicationDate: String!
      genre: String!
      totalCopies: Int!
      description: String
    ): Book!
    
    updateBook(
      id: ID!
      title: String
      author: String
      publicationDate: String
      genre: String
      totalCopies: Int
      description: String
    ): Book!
    
    deleteBook(id: ID!): Book!

    # Borrows
    borrowBook(bookId: ID!): Borrow!
    returnBook(borrowId: ID!): Borrow!

    # Users (Admin)
    updateUser(id: ID!, name: String, email: String, role: String, isActive: Boolean): User!
    deleteUser(id: ID!): User!
  }
`;

module.exports = typeDefs;