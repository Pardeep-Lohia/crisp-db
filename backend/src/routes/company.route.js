import express from 'express';
import { create_company} from '../controllers/Company/create_company.controller.js';
// get the authRouter
const companyRouter = express.Router();

// ✅create company route
companyRouter.post('/create-company', create_company);

export default companyRouter;
