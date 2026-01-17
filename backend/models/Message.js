const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const messageSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    default: uuidv4 
},
  conversation_id: { 
    type: String,
     ref: 'Conversation',
      required: true 
    },
  sender: { 
    type: String, 
    enum: ['user', 'bot', 'agent'], 
    required: true 
},
  content: { 
    type: String, 
    required: true 
},
  created_at: { 
    type: Date, 
    default: Date.now 
}
});

module.exports = mongoose.model('Message', messageSchema);
