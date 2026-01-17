const Plan = require('../controllers/planController');
const express = require('express');
const router = express.Router();

// Route to get all plans
router.get('/plans', async (req, res) => {
    const plans = await Plan.getAllPlans();
    res.json(plans);
});

// Route to create a new plan
router.post('/plans', async (req, res) => {
    const planData = req.body;
    const planId = await Plan.createPlan(planData);
    if (planId) {
        res.status(201).json({ planId });
    }
    else {
        res.status(500).json({ error: 'Failed to create plan' });
    }
});

// Route to get plan details by id
router.get('/plans/:id', async (req, res) => {
    const planId = req.params.id;
    const planDetails = await Plan.getPlanDetails(planId);
    if (planDetails) {
        res.json(planDetails);

    } else {
        res.status(404).json({ error: 'Plan not found' });
    }
});

module.exports = router;