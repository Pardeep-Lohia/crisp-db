import { CompanyUser } from '../../models/CompanyUser.model.js';
import { Company } from '../../models/Company.model.js';
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
  } = req.body;

  // Validate request payload
  if (
    !company_name ||
    !company_domain ||
    !username ||
    !email ||
    !password
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  // Prevent system company domain usage
  const systemCompany = await Company.findOne({ is_system: true });

  if (systemCompany && company_domain === systemCompany.domain) {
    throw new ApiError(400, 'Invalid company domain');
  }

  // Check for duplicate company domain
  const existingCompany = await Company.findOne({ domain: company_domain });

  if (existingCompany) {
    throw new ApiError(400, 'Company already exists with this domain');
  }

  // Check for duplicate admin email
  const existingUser = await CompanyUser.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  // Create customer company
  const company = await Company.create({
    name: company_name,
    domain: company_domain,
    is_system: false,
    status: 'active',
    owner_user_id: null,
    plan_id: null,
  });

  // Create company admin user
  const admin = await CompanyUser.create({
    company_id: company._id,
    username,
    email,
    password_hash: password, // Hashed via pre-save hook
    role: 'company_admin',
  });

  // Assign company owner
  company.owner_user_id = admin._id;
  await company.save();

  // Send safe response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        company: {
          _id: company._id,
          name: company.name,
          domain: company.domain,
        },
        admin: {
          _id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      },
      'Company created successfully'
    )
  );
});
