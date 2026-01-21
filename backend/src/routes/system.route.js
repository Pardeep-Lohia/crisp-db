import express from 'express';

import {
  createSuperAdmin,
  deleteSuperAdmin,
} from '../controllers/bootstrap/superAdmin.service.js';

import { createSuperCompany } from '../controllers/bootstrap/SuperCompany.service.js';

import { verifyBootstrapSecret } from '../middlewares/verifyBootstrapSecret.middleware.js';
import { authenticate } from '../middlewares/Auth.middleware.js';

import {
  createPlan,
  updatePlan,
  deactivatePlan,
  deletePlan,
  getActivePlans,
  getPlanById,
} from '../controllers/SuperAdmin/Plan.controller.js';

/**
 * System Bootstrap Routes
 */
const systemRouter = express.Router();

/**
 * =========================
 * BOOTSTRAP ROUTES
 * =========================
 */

// Create Provider (System) Company (run once)
systemRouter.post(
  '/create-super-company',
  verifyBootstrapSecret,
  createSuperCompany
);

// Create Super Admin
systemRouter.post(
  '/create-super-admin',
  verifyBootstrapSecret,
  createSuperAdmin
);

// Delete Super Admin (dangerous)
systemRouter.delete(
  '/delete-super-admin',
  verifyBootstrapSecret,
  deleteSuperAdmin
);

/**
 * =========================
 * PLAN MANAGEMENT (SuperAdmin)
 * =========================
 */

// Create new plan
systemRouter.post(
  '/plans',
  authenticate,
  createPlan
);

// Update plan
systemRouter.put(
  '/plans/:planId',
  authenticate,
  updatePlan
);

// Deactivate plan
systemRouter.patch(
  '/plans/:planId/deactivate',
  authenticate,
  deactivatePlan
);

// Delete plan (only if unused)
systemRouter.delete(
  '/plans/:planId',
  authenticate,
  deletePlan
);

// Get all active plans (for signup / users)
systemRouter.get(
  '/plans/active',
  authenticate,
  getActivePlans
);

// Get plan by id (query param: ?id=)
systemRouter.get(
  '/plans/by-id',
  authenticate,
  getPlanById
);

export default systemRouter;
