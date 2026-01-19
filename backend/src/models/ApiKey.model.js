import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({

  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },

  api_key: { type: String, required: true, unique: true },

  is_active: { type: Boolean, default: true }

}, { timestamps: true });


apiKeySchema.index(
  { company_id: 1 },
  { unique: true, partialFilterExpression: { is_active: true } }
);

export const ApiKey = mongoose.model('ApiKey', apiKeySchema);
