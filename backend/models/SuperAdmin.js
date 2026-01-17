const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const superAdminSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password_hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SuperAdmin', superAdminSchema);
