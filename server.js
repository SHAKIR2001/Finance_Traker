const Goal = require('./models/Goal');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes'); // Import budget routes
const reportRoutes = require('./routes/reportRoutes'); // Import report routes
const { generateRecurringTransactions, processAutoSavings } = require('./config/recurringJobs'); // Import functions
const goalRoutes = require('./routes/goalRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes
const dashboardRoutes = require('./routes/dashboardRoutes'); // Import Dashboard routes
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const errorHandler = require('./middleware/errorMiddleware'); // Import error handler

//generateRecurringTransactions();   //check the reccuring manually
//processAutoSavings();               //check the reccuring manually




// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize recurring transactions job
generateRecurringTransactions();

const app = express();


// Security Middleware
app.use(helmet()); // Adds security headers
app.use(mongoSanitize()); // Prevents NoSQL Injection
app.use(xss()); // Prevents stored & reflected XSS attacks


// Rate Limiting - Prevents brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 requests per IP                           //when performance  testing set it to 1000
  message: 'Too many requests, please try again later.',
});
app.use('/api', limiter);

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes); // Add budget routes
app.use('/api/reports', reportRoutes); // Add report routes
app.use('/api/goals', goalRoutes);
app.use('/api/categories', categoryRoutes); // Add category routes
app.use('/api/dashboard', dashboardRoutes); // Add dashboard routes

// Error handler - Use after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  processAutoSavings(); // Run auto-save logic on startup
});
