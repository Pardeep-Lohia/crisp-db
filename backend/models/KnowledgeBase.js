const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const knowledgeBaseSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    company_id: {
        type: String,
        ref: 'Company',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number]
    }, // vector representation
    created_by: {
        type: String,
        enum: ['agent', 'admin', 'bot']
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Optional index for embedding search
knowledgeBaseSchema.index({ company_id: 1 });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
