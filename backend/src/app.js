import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import systemRouter from './routes/system.route.js';
import authRouter from './routes/auth.route.js';
import companyRouter from './routes/company.route.js';

const app = express();

/**
 * CORS Configuration
 */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

/**
 * Body Parsers
 */
app.use(
  express.json({
    limit: '16kb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);

/**
 * Static Files
 */
app.use(express.static('public'));

/**
 * Cookie Parser
 */
app.use(cookieParser());

/**
 * API Routes (v1)
 */
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/system', systemRouter);
app.use('/api/v1/company', companyRouter);

export default app;
