const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const companySchema = new mongoose.Schema({
  _id: { 
    type: String, 
    default: uuidv4 
},
  name: { 
    type: String,
     required: true 
    },
  domain: { 
    type: String,
     unique: true 
    },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended', 'blocked'], 
    default: 'active' 
},
  created_at: { 
    type: Date, 
    default: Date.now 
}
});

module.exports = mongoose.model('Company', companySchema);
