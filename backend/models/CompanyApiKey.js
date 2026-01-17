const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const companyApiKeySchema = new mongoose.Schema({
    _id: { 
        type: String,
        default: uuidv4

     },
    company_id: { 
        type: String, 
        ref: 'Company', 
        required: true 
    },
    api_key: { 
        type: String, 
        required: true, 
        unique: true 
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

// One active API key per company
companyApiKeySchema.index({ company_id: 1 }, { unique: true, partialFilterExpression: { is_active: true } });

module.exports = mongoose.model('CompanyApiKey', companyApiKeySchema);
