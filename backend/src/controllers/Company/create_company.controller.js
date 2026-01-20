import { CompanyUser } from '../../models/CompanyUser.model.js';
import {Company} from "../../models/Company.model.js"
import AsyncHandler from '../../utils/AsyncHandler.util.js';
import ApiError from '../../utils/ApiError.util.js';
import ApiResponse from '../../utils/ApiResponse.util.js';


// =========================
// Create Compnay Signup Auto while creating the company
// =========================
export const create_company = AsyncHandler(async (req, res) => {
  const {
    company_name,
    company_domain,
    username,
    email,
    password,
  } = req.body;

  // 1️⃣ Validate input
  if (
    !company_name ||
    !company_domain ||
    !username ||
    !email ||
    !password
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 2️⃣ Prevent system company creation
  const systemCompany = await Company.findOne({ is_system: true });
  if (systemCompany && company_domain === systemCompany.domain) {
    throw new ApiError(400, "Invalid company domain");
  }

  // 3️⃣ Check duplicate company domain
  const existingCompany = await Company.findOne({ domain: company_domain });
  if (existingCompany) {
    throw new ApiError(400, "Company already exists with this domain");
  }

  // 4️⃣ Check duplicate admin email
  const existingUser = await CompanyUser.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  // 5️⃣ Create company (customer company)
  const company = await Company.create({
    name: company_name,
    domain: company_domain,
    is_system: false, // 🔑 IMPORTANT
    status: "active",
    owner_user_id: null,
    plan_id: null, // assign later
  });

  // 6️⃣ Create company admin
  const admin = await CompanyUser.create({
    company_id: company._id,
    username,
    email,
    password_hash: password, // hashed by pre-save hook
    role: "company_admin",
  });

  // 7️⃣ Attach owner
  company.owner_user_id = admin._id;
  await company.save();

  // 8️⃣ Response (safe)
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
      "Company created successfully"
    )
  );
});
