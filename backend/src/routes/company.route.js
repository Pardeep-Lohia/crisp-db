const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

// @route   POST /api/companies
// @desc    Create a new company, admin user, plan, and API key
router.post('/companies', async (req, res) => {
  try {
    const { name, domain, plan_id, username, email, password } = req.body;

    const result = await companyController.createCompany(
      name,
      domain,
      plan_id,
      username,
      email,
      password
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/companies
// @desc    View all companies with their active plans
router.get('/companies', async (req, res) => {
  try {
    const companies = await companyController.viewAllCompanies();
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PATCH /api/companies/:id/status
// @desc    Update company status (active, inactive, blocked)
router.patch('/companies/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedCompany = await companyController.updateCompanyStatus(req.params.id, status);

    if (!updatedCompany) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({
      success: true,
      data: updatedCompany,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
