import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },

  domain: { type: String, unique: true, sparse: true },

  owner_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyUser',
    required: true
  },

  plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'blocked'],
    default: 'active'
  }

}, { timestamps: true });

export const Company = mongoose.model('Company', companySchema);
