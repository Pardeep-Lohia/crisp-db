const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const handoverLogSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    conversation_id: {
        type: String,
        ref: 'Conversation',
        required: true
    },
    agent_id: {
        type: String,
        ref: 'CompanyUser',
        required: true
    },
    started_at: {
        type: Date,
        default: Date.now
    },
    ended_at: {
        type: Date
    }
});

module.exports = mongoose.model('HandoverLog', handoverLogSchema);
