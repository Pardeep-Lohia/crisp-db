import express from 'express';
import {
  createSuperAdmin,
  deleteSuperAdmin,
} from '../controllers/bootstrap/superAdmin.service.js';
import { createSuperCompany } from '../controllers/bootstrap/SuperCompany.service.js';
import { verifyBootstrapSecret } from '../middlewares/verifyBootstrapSecret.middleware.js';

/**
 * System Bootstrap Routes
 */
const systemRouter = express.Router();

/**
 * Create Provider (System) Company
 * Intended to run only once
 */
systemRouter.post(
  '/create-super-company',
  verifyBootstrapSecret,
  createSuperCompany
);

/**
 * Create Super Admin
 */
systemRouter.post(
  '/create-super-admin',
  verifyBootstrapSecret,
  createSuperAdmin
);

/**
 * Delete Super Admin
 * Restricted and destructive operation
 */
systemRouter.delete(
  '/delete-super-admin',
  verifyBootstrapSecret,
  deleteSuperAdmin
);

export default systemRouter;
