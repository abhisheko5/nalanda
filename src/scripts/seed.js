require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Book = require('../models/Book.model');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@nalanda.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin created:', admin.email);

    // Create member user
    const member = await User.create({
      name: 'John Member',
      email: 'member@nalanda.com',
      password: 'member123',
      role: 'member'
    });
    console.log('Member created:', member.email);

    // Create sample books
    const books = await Book.insertMany([
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', publicationDate: new Date('1925-04-10'), genre: 'Fiction', totalCopies: 5, availableCopies: 5 },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', publicationDate: new Date('1960-07-11'), genre: 'Fiction', totalCopies: 3, availableCopies: 3 },
      { title: '1984', author: 'George Orwell', isbn: '978-0451524935', publicationDate: new Date('1949-06-08'), genre: 'Dystopian', totalCopies: 4, availableCopies: 4 },
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', publicationDate: new Date('2008-08-01'), genre: 'Technology', totalCopies: 2, availableCopies: 2 },
      { title: 'The Pragmatic Programmer', author: 'David Thomas', isbn: '978-0135957059', publicationDate: new Date('2019-09-13'), genre: 'Technology', totalCopies: 3, availableCopies: 3 }
    ]);
    console.log(`${books.length} books created`);

    console.log('\n--- Seed Complete ---');
    console.log('Admin Login: admin@nalanda.com / admin123');
    console.log('Member Login: member@nalanda.com / member123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();