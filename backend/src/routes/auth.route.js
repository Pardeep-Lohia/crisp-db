import express from 'express';
import { login } from '../controllers/auth.controller.js';

// get the authRouter
const authRouter = express.Router();

// ✅ Login route
authRouter.post('/login', login);

export default authRouter;
