import dotenv from 'dotenv';

// helper function...
dotenv.config({
  path: ['.env'],
});

import connectDB from './db/db.js';
import app from './app.js';

// connect to DataBase
connectDB()
  // if database connected successfully...
  // but could not start express app...
  .then(() => {
    app.on('error', (error) => {
      console.error('Error in Express app:', error.message);
      throw error;
    });
    // if express app run in proper way...
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at :${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });
