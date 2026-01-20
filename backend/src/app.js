import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // allow session cookie, headers from browser to pass through
  })
);

// Body parser middleware
app.use(
  express.json({
    limit: '16kb',
  })
);

// Form data parser middleware
app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);

// give direct of public folder to express
app.use(express.static('public'));

// Parse cookies middleware
app.use(cookieParser());

// Routers v1

// export app
export default app;
