const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const endUserSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    company_id: {
        type: String,
        ref: 'Company',
        required: true
    },
    session_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EndUser', endUserSchema);
