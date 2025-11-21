# Nalanda Library Management System

A comprehensive backend system for library management built with Node.js, Express, MongoDB, and GraphQL.

## Features

- **User Management**: Registration, login, JWT authentication with encryption
- **Role-Based Access Control**: Admin and Member roles
- **Book Management**: CRUD operations for books
- **Borrowing System**: Borrow/return books with history tracking
- **Reports & Analytics**: MongoDB aggregation-based reports
- **Dual API**: RESTful API + GraphQL API

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose ODM
- Apollo Server (GraphQL)
- JWT with AES encryption
- express-validator

---

## Project Structure

```
nalanda-library/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── book.controller.js
│   │   ├── borrow.controller.js
│   │   ├── report.controller.js
│   │   └── user.controller.js
│   ├── graphql/
│   │   ├── typeDefs.js
│   │   └── resolvers.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Book.model.js
│   │   └── Borrow.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── book.routes.js
│   │   ├── borrow.routes.js
│   │   ├── report.routes.js
│   │   └── user.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── book.service.js
│   │   ├── borrow.service.js
│   │   ├── report.service.js
│   │   └── user.service.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   └── jwt.js
│   ├── validators/
│   │   └── index.js
│   ├── scripts/
│   │   └── seed.js
│   └── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone/Create Project

```bash
mkdir nalanda-library
cd nalanda-library
```

### 2. Initialize & Install Dependencies

```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken express-validator dotenv cors helmet morgan @apollo/server graphql crypto-js
npm install -D nodemon
```

### 3. Create Environment File

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nalanda_library
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_ENCRYPTION_KEY=your_32_char_encryption_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Create Directory Structure

```bash
mkdir -p src/{config,controllers,graphql,middlewares,models,routes,services,utils,validators,scripts}
```

### 5. Add All Source Files

Copy all the provided source files into their respective directories.

### 6. Update package.json Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "seed": "node src/scripts/seed.js"
  }
}
```

### 7. Seed Database

```bash
npm run seed
```

### 8. Start Server

```bash
npm run dev
```

Server runs at:
- REST API: `http://localhost:5000/api`
- GraphQL: `http://localhost:5000/graphql`

---

## API Documentation

### Authentication

All protected routes require Bearer token:
```
Authorization: Bearer <encrypted_token>
```

### REST API Endpoints

#### Auth Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/profile` | Protected | Get profile |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Book Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/books` | Protected | List books |
| GET | `/api/books/:id` | Protected | Get book |
| POST | `/api/books` | Admin | Create book |
| PUT | `/api/books/:id` | Admin | Update book |
| DELETE | `/api/books/:id` | Admin | Delete book |

**Query Parameters for List:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `genre` - Filter by genre
- `author` - Filter by author
- `search` - Search in title/author/genre
- `sortBy` - Sort field (default: createdAt)
- `order` - asc/desc (default: desc)

**Create Book Request:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "978-1234567890",
  "publicationDate": "2023-01-15",
  "genre": "Fiction",
  "totalCopies": 5,
  "description": "Optional description"
}
```

#### Borrow Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/borrow` | Protected | Borrow book |
| PUT | `/api/borrow/:id/return` | Protected | Return book |
| GET | `/api/borrow/history` | Protected | User history |
| GET | `/api/borrow/all` | Admin | All borrows |

**Borrow Request:**
```json
{
  "bookId": "mongodb_object_id"
}
```

#### Report Routes (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/most-borrowed` | Most borrowed books |
| GET | `/api/reports/active-members` | Most active members |
| GET | `/api/reports/availability` | Book availability summary |

#### User Routes (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Deactivate user |

---

### GraphQL API

Access GraphQL Playground at: `http://localhost:5000/graphql`

#### Queries

```graphql
# Get current user
query { me { id name email role } }

# List books with pagination
query {
  books(page: 1, limit: 10, genre: "Fiction") {
    books { id title author availableCopies }
    total pages
  }
}

# Get borrow history
query {
  myBorrowHistory(page: 1) {
    borrows { id book { title } borrowDate status }
    total
  }
}

# Reports (Admin)
query { mostBorrowedBooks(limit: 5) { title borrowCount } }
query { activeMembers(limit: 5) { name totalBorrows } }
query { bookAvailability { summary { totalCopies availableCopies } } }
```

#### Mutations

```graphql
# Register
mutation {
  register(name: "John", email: "john@test.com", password: "pass123") {
    token user { id name }
  }
}

# Login
mutation {
  login(email: "admin@nalanda.com", password: "admin123") {
    token user { id role }
  }
}

# Create Book (Admin)
mutation {
  createBook(
    title: "New Book"
    author: "Author"
    isbn: "978-111"
    publicationDate: "2024-01-01"
    genre: "Tech"
    totalCopies: 3
  ) { id title }
}

# Borrow Book
mutation {
  borrowBook(bookId: "book_id_here") {
    id dueDate book { title }
  }
}

# Return Book
mutation {
  returnBook(borrowId: "borrow_id_here") {
    id returnDate status
  }
}
```

---

## Test Credentials

After running seed:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nalanda.com | admin123 |
| Member | member@nalanda.com | member123 |

---

## Security Features

1. **Password Hashing**: bcrypt with 12 salt rounds
2. **JWT Encryption**: AES encryption layer on JWT tokens
3. **Role-Based Access**: Admin/Member permissions
4. **Input Validation**: express-validator on all inputs
5. **Security Headers**: Helmet middleware
6. **Error Handling**: Centralized error handling

---

## Database Schemas

### User Schema
- name, email (unique), password (hashed), role (admin/member), isActive, timestamps

### Book Schema  
- title, author, isbn (unique), publicationDate, genre, totalCopies, availableCopies, description, isActive, timestamps

### Borrow Schema
- user (ref), book (ref), borrowDate, dueDate, returnDate, status (borrowed/returned/overdue), timestamps

---

## Aggregation Reports

1. **Most Borrowed Books**: Groups borrows by book, counts, sorts descending
2. **Active Members**: Groups borrows by user, counts total and current borrows
3. **Book Availability**: Summarizes total/available/borrowed copies with genre breakdown