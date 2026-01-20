import express from 'express';
import { create_company} from '../controllers/Company/create_company.controller.js';
import { invite_employee_from_same_company } from "../controllers/invite/inviteEmployee.controller.js";
import { accept_invite_and_signup } from "../controllers/invite/acceptInvite.controller.js";
import { authenticate } from "../middlewares/Auth.middleware.js";

// get the authRouter
const companyRouter = express.Router();

// create company route
companyRouter.post('/create-company', create_company);

// invite employee route// Admin / Super Admin invite
companyRouter.post("/send-invite",authenticate,invite_employee_from_same_company);

// Employee accepts invite
companyRouter.post("/accept-invite",accept_invite_and_signup);

export default companyRouter;


