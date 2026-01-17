const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const planSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    token_limit: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration_value: {
        type: Number,
        required: true,
        min: 1
    },
    duration_unit: {
        type: String,
        enum: ['month', 'year'],
        required: true
    },
    max_agents: {
        type: Number,
        default: 1
    },
    human_handover: {
        type: Boolean,
        default: false
    },
    knowledge_base: {
        type: Boolean,
        default: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Plan', planSchema);
