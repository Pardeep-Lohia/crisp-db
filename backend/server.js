require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js"); // Import the connection function
const planRoutes = require("./routes/planRoutes.js");
// Add this line with your other imports
const companyRoutes = require("./routes/companyRoutes.js");


// Initialize Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", planRoutes);

// Add this line with your other routes
app.use("/company", companyRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});