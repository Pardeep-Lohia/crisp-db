const Plan = require('../models/Plan');

/**
 * Get all plans
 */
async function getAllPlans() {
  try {
    const plans = await Plan.find({}, {
      _id: 1,
      name: 1,
      description: 1,
      token_limit: 1,
      price: 1,
      max_agents: 1,
      human_handover: 1,
      knowledge_base: 1,
      is_active: 1,
    }).lean();
    return plans;
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}

/**
 * Create a new plan
 */
async function createPlan({
  name,
  description,
  token_limit,
  price,
  duration_value,
  duration_unit,
  max_agents = 1,
  human_handover = false,
  knowledge_base = true,
}) {
  try {
    const plan = new Plan({
      name,
      description,
      token_limit,
      price,
      duration_value,
      duration_unit,
      max_agents,
      human_handover,
      knowledge_base,
    });
    await plan.save();
    return plan._id;
  } catch (error) {
    console.error("Error creating plan:", error);
    return null;
  }
}

/**
 * Get plan details by id
 */
async function getPlanDetails(planId) {
  try {
    const plan = await Plan.findById(planId).lean();
    return plan || null;
  } catch (error) {
    console.error("Error fetching plan details:", error);
    return null;
  }
}

/**
 * Update a plan
 */
async function updatePlan(planId, updates) {
  const allowedFields = [
    "name",
    "description",
    "token_limit",
    "price",
    "duration_value",
    "duration_unit",
    "max_agents",
    "human_handover",
    "knowledge_base",
    "is_active",
  ];
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  );

  if (!Object.keys(filteredUpdates).length) return false;

  try {
    const result = await Plan.updateOne({ _id: planId }, { $set: filteredUpdates });
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating plan:", error);
    return false;
  }
}

/**
 * Delete a plan
 * Only if no company uses it (assuming a Company model exists)
 */
async function deletePlan(planId, Company) {
  try {
    const count = await Company.countDocuments({ plan_id: planId });
    if (count > 0) return false; // Plan in use

    const result = await Plan.deleteOne({ _id: planId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting plan:", error);
    return false;
  }
}

module.exports = {
  getAllPlans,
  createPlan,
  getPlanDetails,
  updatePlan,
  deletePlan,
};
