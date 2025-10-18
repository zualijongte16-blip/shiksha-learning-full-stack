const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Get all chats for a user
router.get('/chats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const chats = await Chat.find({
      'participants.userId': userId,
      isActive: true
    })
    .populate('participants.userId', 'firstName lastName email role')
    .populate('lastMessage.senderId', 'firstName lastName')
    .sort({ 'lastMessage.timestamp': -1 });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request chat between student and teacher
router.post('/chats/request', verifyToken, async (req, res) => {
  try {
    const { teacherId } = req.body;
    const studentId = req.user.id;

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can request chats' });
    }

    // Verify teacher exists and is a teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check if chat request already exists
    let chat = await Chat.findOne({
      'participants.userId': { $all: [studentId, teacherId] },
      'participants.role': { $in: ['student', 'teacher'] }
    });

    if (chat) {
      if (chat.status === 'accepted') {
        return res.json({ message: 'Chat already exists and is active', chat });
      } else if (chat.status === 'pending') {
        return res.json({ message: 'Chat request already pending', chat });
      } else if (chat.status === 'rejected') {
        // Allow re-requesting if previously rejected
        chat.status = 'pending';
        await chat.save();
        return res.json({ message: 'Chat request sent again', chat });
      }
    }

    // Create new chat request
    chat = new Chat({
      participants: [
        { userId: studentId, role: 'student' },
        { userId: teacherId, role: 'teacher' }
      ],
      messages: [],
      lastMessage: {
        content: 'Chat request sent',
        timestamp: new Date(),
        senderId: studentId
      },
      status: 'pending',
      requestedBy: studentId
    });
    await chat.save();

    // Populate and return chat
    await chat.populate('participants.userId', 'firstName lastName email role');
    await chat.populate('lastMessage.senderId', 'firstName lastName');
    await chat.populate('requestedBy', 'firstName lastName');

    res.json({ message: 'Chat request sent successfully', chat });
  } catch (error) {
    console.error('Error requesting chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept or reject chat request (teachers only)
router.put('/chats/:chatId/status', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const userId = req.user.id;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can accept/reject chat requests' });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      'participants.userId': userId,
      'participants.role': 'teacher'
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat request not found' });
    }

    if (chat.status !== 'pending') {
      return res.status(400).json({ message: 'Chat request has already been processed' });
    }

    if (action === 'accept') {
      chat.status = 'accepted';
      chat.acceptedAt = new Date();
      chat.lastMessage = {
        content: 'Chat request accepted',
        timestamp: new Date(),
        senderId: userId
      };
    } else if (action === 'reject') {
      chat.status = 'rejected';
      chat.lastMessage = {
        content: 'Chat request rejected',
        timestamp: new Date(),
        senderId: userId
      };
    } else {
      return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject"' });
    }

    await chat.save();

    // Populate and return updated chat
    await chat.populate('participants.userId', 'firstName lastName email role');
    await chat.populate('lastMessage.senderId', 'firstName lastName');
    await chat.populate('requestedBy', 'firstName lastName');

    res.json({ message: `Chat request ${action}ed`, chat });
  } catch (error) {
    console.error('Error updating chat status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active chats (only accepted chats)
router.get('/chats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      'participants.userId': userId,
      isActive: true,
      status: 'accepted'
    })
    .populate('participants.userId', 'firstName lastName email role')
    .populate('lastMessage.senderId', 'firstName lastName')
    .sort({ 'lastMessage.timestamp': -1 });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending chat requests (for teachers)
router.get('/chats/requests', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can view chat requests' });
    }

    const requests = await Chat.find({
      'participants.userId': userId,
      'participants.role': 'teacher',
      status: 'pending',
      isActive: true
    })
    .populate('participants.userId', 'firstName lastName email role')
    .populate('requestedBy', 'firstName lastName email')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching chat requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a specific chat
router.get('/chats/:chatId/messages', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({
      _id: chatId,
      'participants.userId': userId,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message in a chat
router.post('/chats/:chatId/messages', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;
    const senderRole = req.user.role;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      'participants.userId': senderId,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = {
      senderId,
      senderRole,
      content: content.trim(),
      timestamp: new Date(),
      read: false
    };

    chat.messages.push(newMessage);
    chat.lastMessage = {
      content: content.trim(),
      timestamp: new Date(),
      senderId
    };

    await chat.save();

    // Populate sender info for response
    await chat.populate('messages.senderId', 'firstName lastName');

    const addedMessage = chat.messages[chat.messages.length - 1];

    res.json(addedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/chats/:chatId/read', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({
      _id: chatId,
      'participants.userId': userId,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all messages not sent by current user as read
    chat.messages.forEach(message => {
      if (message.senderId.toString() !== userId && !message.read) {
        message.read = true;
      }
    });

    await chat.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
