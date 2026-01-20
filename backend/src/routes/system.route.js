import express from 'express';
import { createSuperAdmin, deleteSuperAdmin } from '../controllers/bootstrap/superAdmin.service.js';
import { createSuperCompany } from '../controllers/bootstrap/SuperCompany.service.js';
import { verifyBootstrapSecret } from '../middlewares/verifyBootstrapSecret.middleware.js';

const systemRouter = express.Router();

// ✅ Create provider company (runs only once)
systemRouter.post('/create-super-company', verifyBootstrapSecret, createSuperCompany);

// ✅ Create super admin
systemRouter.post('/create-super-admin', verifyBootstrapSecret, createSuperAdmin);

// ❌ Dangerous action → must be explicit
systemRouter.delete('/delete-super-admin', verifyBootstrapSecret, deleteSuperAdmin);

export default systemRouter;
