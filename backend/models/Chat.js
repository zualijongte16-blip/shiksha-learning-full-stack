const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true }
  }],
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['student', 'teacher'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  lastMessage: {
    content: { type: String },
    timestamp: { type: Date, default: Date.now },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedAt: { type: Date }
}, { timestamps: true });

// Index for efficient querying
chatSchema.index({ 'participants.userId': 1 });
chatSchema.index({ 'lastMessage.timestamp': -1 });

module.exports = mongoose.model('Chat', chatSchema);
