const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const conversationSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    company_id: {
        type: String,
        ref: 'Company',
        required: true
    },
    end_user_id: {
        type: String,
        ref: 'EndUser'
    },
    status: {
        type: String,
        enum: ['bot', 'human'],
        default: 'bot'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', conversationSchema);
