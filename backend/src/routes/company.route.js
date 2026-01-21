import express from 'express';
import { createCompany } from '../controllers/Company/create_company.controller.js';
import { inviteEmployeeFromSameCompany } from '../controllers/invite/inviteEmployee.controller.js';
import { acceptInviteAndSignup } from '../controllers/invite/acceptInvite.controller.js';
import { authenticate } from '../middlewares/Auth.middleware.js';

/**
 * Company Routes
 */
const companyRouter = express.Router();

/**
 * Create Company
 */
companyRouter.post('/create-company', createCompany);

/**
 * Invite Employee (Admin / Super Admin)
 */
companyRouter.post(
  '/send-invite',
  authenticate,
  inviteEmployeeFromSameCompany
);

/**
 * Accept Invite and Sign Up
 */
companyRouter.post('/accept-invite', acceptInviteAndSignup);

export default companyRouter;
