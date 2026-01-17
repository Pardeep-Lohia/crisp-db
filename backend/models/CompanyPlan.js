const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const companyPlanSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    default: uuidv4 
  },
  company_id: { 
    type: String, 
    ref: 'Company', 
    required: true 
  },
  plan_id: { 
    type: String, 
    ref: 'Plan', 
    required: true 
  },
  start_date: { 
    type: Date, 
    default: Date.now 
  },
  end_date: { 
    type: Date, 
    required: true 
  },
  token_limit: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  tokens_used: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'cancelled'], 
    default: 'active' 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Enforce one active plan per company
companyPlanSchema.index({ company_id: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });

module.exports = mongoose.model('CompanyPlan', companyPlanSchema);
