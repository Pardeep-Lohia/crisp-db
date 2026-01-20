import { Company } from '../../models/Company.model.js';
import { CompanyUser } from '../../models/CompanyUser.model.js';
import ApiResponse from '../../utils/ApiResponse.util.js';
import ApiError from '../../utils/ApiError.util.js';
import AsyncHandler from '../../utils/AsyncHandler.util.js';

/**
 * Create Super Admin (Provider company only)
 */
export const createSuperAdmin = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // ✅ Validate input
  if (!username || !email || !password) {
    throw new ApiError(400, 'username, email and password are required');
  }

  // 1️⃣ Check provider company
  const company = await Company.findOne({ is_system: true });

  if (!company) {
    throw new ApiError(404, 'Provider company does not exist');
  }

  // 2️⃣ Check if super admin already exists
  const existing = await CompanyUser.findOne({
    company_id: company._id,
    role: 'super_admin',
  });

  if (existing) {
    throw new ApiError(400, 'Super admin already exists');
  }

  // 3️⃣ Create super admin
  const superAdmin = await CompanyUser.create({
    company_id: company._id,
    username,
    email,
    password_hash: password, // hashed by pre-save hook
    role: 'super_admin',
  });

  // 4️⃣ Attach owner (only if not already set)
  if (!company.owner_user_id) {
    company.owner_user_id = superAdmin._id;
    await company.save();
  }

  // ✅ Safe response (NO password / tokens)
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: superAdmin._id,
        username: superAdmin.username,
        email: superAdmin.email,
        role: superAdmin.role,
      },
      'Super admin created successfully'
    )
  );
});

/**
 * Delete Super Admin (Provider company only)
 */
export const deleteSuperAdmin = AsyncHandler(async (req, res) => {
  // 1️⃣ Find provider company
  const systemCompany = await Company.findOne({ is_system: true });

  if (!systemCompany) {
    throw new ApiError(404, 'Provider company not found');
  }

  // 2️⃣ Find super admin
  const superAdmin = await CompanyUser.findOne({
    company_id: systemCompany._id,
    role: 'super_admin',
  });

  if (!superAdmin) {
    return res.status(200).json(new ApiResponse(200, null, 'Super admin does not exist'));
  }

  // 3️⃣ Delete super admin
  await CompanyUser.deleteOne({ _id: superAdmin._id });

  // 4️⃣ Remove owner reference
  systemCompany.owner_user_id = null;
  await systemCompany.save();

  return res.status(200).json(new ApiResponse(200, null, 'Super admin deleted successfully'));
});
