import { CompanyUser } from '../../models/CompanyUser.model.js';
import { Company } from '../../models/Company.model.js';
import { Plan } from '../../models/Plan.model.js';
import { ApiKey } from '../../models/ApiKey.model.js';
import AsyncHandler from '../../utils/AsyncHandler.util.js';
import ApiError from '../../utils/ApiError.util.js';
import ApiResponse from '../../utils/ApiResponse.util.js';

/**
 * Create Customer Company with Admin User
 * Automatically creates a company and assigns a company admin
 */
export const createCompany = AsyncHandler(async (req, res) => {
  const {
    company_name,
    company_domain,
    username,
    email,
    password,
    phone_number,
    plan_id,
  } = req.body;

  // Validate input
  if (
    !company_name ||
    !company_domain ||
    !username ||
    !email ||
    !password ||
    !phone_number ||
    !plan_id
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  // Validate plan
  const plan = await Plan.findOne({
    _id: plan_id,
    is_active: true,
  });

  if (!plan) {
    throw new ApiError(400, 'Invalid or inactive plan');
  }

  // Prevent system company domain
  const systemCompany = await Company.findOne({ is_system: true });
  if (systemCompany && systemCompany.domain === company_domain) {
    throw new ApiError(400, 'Invalid company domain');
  }

  // Check duplicate company
  const existingCompany = await Company.findOne({ domain: company_domain });
  if (existingCompany) {
    throw new ApiError(400, 'Company already exists with this domain');
  }

  // Check duplicate admin
  const existingUser = await CompanyUser.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  // Create company
  const company = await Company.create({
    name: company_name,
    domain: company_domain,
    is_system: false,
    status: 'active',
    owner_user_id: null,
    plan_id: plan._id,
  });

  // Create admin
  const admin = await CompanyUser.create({
    company_id: company._id,
    username,
    email,
    password_hash: password,
    role: 'company_admin',
    phone_number,
  });

  // Assign owner
  company.owner_user_id = admin._id;
  await company.save();

  // Generate API key (one-time reveal)
  const apiKey = crypto.randomBytes(32).toString('hex');

  await ApiKey.create({
    company_id: company._id,
    key: apiKey,
    name: 'Primary API Key',
  });

  // Response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        company: {
          _id: company._id,
          name: company.name,
          domain: company.domain,
        },
        plan: {
          _id: plan._id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          billing_cycle: plan.billing_cycle,
          duration_days: plan.duration_days,
        },
        admin: {
          _id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          phone_number: admin.phone_number,
        },
        api_key: apiKey,
        note: 'Save this API key securely. It will not be shown again.',
      },
      'Company created successfully'
    )
  );
});
