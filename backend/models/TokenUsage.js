const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const tokenUsageSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    company_id: {
        type: String,
        ref: 'Company',
        required: true
    },
    company_plan_id: {
        type: String,
        ref: 'CompanyPlan',
        required: true
    },
    conversation_id: {
        type: String,
        ref: 'Conversation'
    },
    message_id: {
        type: String,
        ref: 'Message'
    },
    model: {
        type: String,
        required: true
    },
    prompt_tokens: {
        type: Number,
        required: true,
        min: 0
    },
    completion_tokens: {
        type: Number,
        required: true,
        min: 0
    },
    total_tokens: {
        type: Number
    }, // calculated before save
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to calculate total_tokens
tokenUsageSchema.pre('save', function (next) {
    this.total_tokens = this.prompt_tokens + this.completion_tokens;
    next();
});

// Indexes for performance
tokenUsageSchema.index({ company_id: 1 });
tokenUsageSchema.index({ company_plan_id: 1 });
tokenUsageSchema.index({ created_at: 1 });

module.exports = mongoose.model('TokenUsage', tokenUsageSchema);
