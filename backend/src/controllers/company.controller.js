const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Company = require('../models/Company');
const Plan = require('../models/Plan.model');
const CompanyUser = require('../models/CompanyUser');
const CompanyPlan = require('../models/CompanyPlan');
const CompanyApiKey = require('../models/CompanyApiKey');

// Helper to calculate end date (equivalent to relativedelta)
const calculateEndDate = (startDate, value, unit) => {
  const date = new Date(startDate);
  if (unit === 'month') {
    date.setMonth(date.getMonth() + value);
  } else if (unit === 'year') {
    date.setFullYear(date.getFullYear() + value);
  } else {
    throw new Error("duration_unit must be 'month' or 'year'");
  }
  return date;
};

// =========================================================
// CREATE COMPANY (Equivalent to create_company)
// =========================================================
exports.createCompany = async (name, domain, planId, username, email, password) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch Plan Details
    const plan = await Plan.findOne({ _id: planId, is_active: true }).session(session);
    if (!plan) throw new Error('Invalid or inactive plan');

    // 2. Create Company
    const company = new Company({ name, domain, plan_id: planId });
    await company.save({ session });

    // 3. Calculate Dates
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, plan.duration_value, plan.duration_unit);

    // 4. Assign Plan (CompanyPlan)
    const companyPlan = new CompanyPlan({
      company_id: company._id,
      plan_id: planId,
      start_date: startDate,
      end_date: endDate,
      token_limit: plan.token_limit,
    });
    await companyPlan.save({ session });

    // 5. Create Admin User
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new CompanyUser({
      company_id: company._id,
      username,
      email,
      password_hash: hashedPassword,
      role: 'admin',
    });
    await adminUser.save({ session });

    // 6. create knowledge base of company

    // 7. Create API Key
    const apiKey = 'skv-to-' + crypto.randomBytes(32).toString('hex');
    const companyApiKey = new CompanyApiKey({
      company_id: company._id,
      api_key: apiKey,
    });
    await companyApiKey.save({ session });

    // COMMIT TRANSACTION
    await session.commitTransaction();

    return {
      company_id: company._id,
      status: company.status,
      api_key: apiKey,
      plan_expires_at: endDate,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`Create company failed: ${error.message}`);
  } finally {
    session.endSession();
  }
};

// =========================================================
// VIEW ALL COMPANIES (With Left Join equivalent)
// =========================================================
exports.viewAllCompanies = async () => {
  return await Company.aggregate([
    {
      $lookup: {
        from: 'companyplans', // Mongoose collection name is usually lowercase plural
        let: { compId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$company_id', '$$compId'] }, { $eq: ['$status', 'active'] }],
              },
            },
          },
        ],
        as: 'activePlan',
      },
    },
    { $unwind: { path: '$activePlan', preserveNullAndEmptyArrays: true } },
    { $sort: { created_at: -1 } },
  ]);
};

// =========================================================
// UPDATE / ACTIVATE / DEACTIVATE
// =========================================================
exports.updateCompanyStatus = async (companyId, status) => {
  return await Company.findByIdAndUpdate(companyId, { status }, { new: true });
};
