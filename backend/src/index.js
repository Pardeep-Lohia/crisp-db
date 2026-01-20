import dotenv from 'dotenv';
dotenv.config(); // ✅ load env FIRST
import connectDB from './db/db.js';
import app from './app.js';

const startServer = async () => {
  try {
    // 1️⃣ Connect DB
    await connectDB();
    console.log('✅ Database connected');

    // 3️⃣ Handle express errors
    app.on('error', (error) => {
      console.error('Error in Express app:', error.message);
      throw error;
    });

    // 4️⃣ Start server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at :${process.env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
