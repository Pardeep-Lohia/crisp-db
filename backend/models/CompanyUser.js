const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const companyUserSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    company_id: {
        type: String,
        ref: 'Company',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password_hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'agent'],
        required: true
    },
    is_online: {
        type: Boolean,
        default: false
    },
    is_locked: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Unique email per company
companyUserSchema.index({ company_id: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('CompanyUser', companyUserSchema);
