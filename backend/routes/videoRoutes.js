const express = require('express');
const {
  createVideoCall,
  joinVideoCall,
  endVideoCall,
  getCallStatus,
  getAvailableStudents
} = require('../controllers/videoController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All video routes require authentication
router.use(verifyToken);

// Create a new video call room
router.post('/create-call', createVideoCall);

// Join a video call room
router.post('/join-call', joinVideoCall);

// End a video call
router.post('/end-call', endVideoCall);

// Get call room status
router.get('/call-status/:roomId', getCallStatus);

// Get available students for a teacher
router.get('/available-students/:teacherId', getAvailableStudents);

module.exports = router;