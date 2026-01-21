import express from 'express';
import { login } from '../controllers/auth.controller.js';

/**
 * Authentication Routes
 */
const authRouter = express.Router();

/**
 * Login
 */
authRouter.post('/login', login);

export default authRouter;
