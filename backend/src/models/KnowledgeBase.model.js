import mongoose from 'mongoose';

const knowledgeDocSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      index: true,
    },

    title: String,

    source_type: {
      type: String,
      enum: ['pdf', 'url', 'text', 'faq'],
    },

    source_ref: String,

    vector_ids: [String],

    status: {
      type: String,
      enum: ['processing', 'ready', 'failed'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

export const KnowledgeDocument = mongoose.model('KnowledgeDocument', knowledgeDocSchema);
