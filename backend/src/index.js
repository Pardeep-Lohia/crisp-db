import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';

// Initialize Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import planRoutes from './routes/plan.routes.js';
import companyRoutes from './routes/company.Route.js';
// Routes
app.use('/api', planRoutes);

// Add this line with your other routes
app.use('/company', companyRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
