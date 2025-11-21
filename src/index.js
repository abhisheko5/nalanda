require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { verifyToken } = require('./utils/jwt');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const borrowRoutes = require('./routes/borrow.routes');
const reportRoutes = require('./routes/report.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Nalanda Library API is running' });
});

// Error handling middleware
app.use(require('./middlewares/error.middleware'));

async function startServer() {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 4000;

  // Start Express REST API
  app.listen(PORT, () => {
    console.log(`REST API running on http://localhost:${PORT}/api`);
  });

  // Apollo GraphQL Server (standalone)
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  
  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port: GRAPHQL_PORT },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      let user = null;
      if (token) {
        try {
          user = verifyToken(token);
        } catch (e) {
          user = null;
        }
      }
      return { user };
    }
  });

  console.log(`GraphQL API running on ${url}`);
}

startServer();