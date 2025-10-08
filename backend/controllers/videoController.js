const User = require('../models/User');

// In-memory storage for active calls (in production, use Redis)
const activeCalls = new Map();

// Generate unique room ID
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

// Create a new video call room
exports.createVideoCall = async (req, res) => {
  try {
    const { studentId, teacherId } = req.body;
    const roomId = generateRoomId();

    // Verify teacher exists and is authenticated
    const teacher = await User.findOne({ teacherId, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Verify student exists
    const student = await User.findOne({ teacherId: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Create call room
    const callRoom = {
      roomId,
      teacherId,
      studentId,
      status: 'waiting', // waiting, active, ended
      createdAt: new Date(),
      participants: [
        { userId: teacherId, role: 'teacher', joined: false },
        { userId: studentId, role: 'student', joined: false }
      ]
    };

    activeCalls.set(roomId, callRoom);

    res.status(201).json({
      success: true,
      roomId,
      message: 'Video call room created successfully'
    });

  } catch (error) {
    console.error('Create video call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating video call'
    });
  }
};

// Join a video call room
exports.joinVideoCall = async (req, res) => {
  try {
    const { roomId, userId, userRole } = req.body;

    const callRoom = activeCalls.get(roomId);
    if (!callRoom) {
      return res.status(404).json({
        success: false,
        message: 'Call room not found'
      });
    }

    // Verify user is participant in this call
    const participant = callRoom.participants.find(p =>
      p.userId === userId && p.role === userRole
    );

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to join this call'
      });
    }

    // Mark participant as joined
    participant.joined = true;

    // Check if both participants have joined
    const allJoined = callRoom.participants.every(p => p.joined);

    res.status(200).json({
      success: true,
      message: 'Joined call successfully',
      callRoom: {
        roomId: callRoom.roomId,
        status: allJoined ? 'active' : 'waiting',
        participants: callRoom.participants
      }
    });

  } catch (error) {
    console.error('Join video call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error joining video call'
    });
  }
};

// End a video call
exports.endVideoCall = async (req, res) => {
  try {
    const { roomId } = req.body;

    const callRoom = activeCalls.get(roomId);
    if (!callRoom) {
      return res.status(404).json({
        success: false,
        message: 'Call room not found'
      });
    }

    // Mark call as ended
    callRoom.status = 'ended';
    callRoom.endedAt = new Date();

    // Remove from active calls after a delay
    setTimeout(() => {
      activeCalls.delete(roomId);
    }, 30000); // Keep for 30 seconds for cleanup

    res.status(200).json({
      success: true,
      message: 'Video call ended successfully'
    });

  } catch (error) {
    console.error('End video call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error ending video call'
    });
  }
};

// Get call room status
exports.getCallStatus = async (req, res) => {
  try {
    const { roomId } = req.params;

    const callRoom = activeCalls.get(roomId);
    if (!callRoom) {
      return res.status(404).json({
        success: false,
        message: 'Call room not found'
      });
    }

    res.status(200).json({
      success: true,
      callRoom: {
        roomId: callRoom.roomId,
        status: callRoom.status,
        participants: callRoom.participants
      }
    });

  } catch (error) {
    console.error('Get call status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting call status'
    });
  }
};

// Get available students for a teacher
exports.getAvailableStudents = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Verify teacher exists
    const teacher = await User.findOne({ teacherId, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Get all students (in production, filter by teacher's assigned students)
    const students = await User.find({ role: 'student' }, 'firstName lastName email phone class');

    res.status(200).json({
      success: true,
      students: students.map(student => ({
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        phone: student.phone,
        class: student.class
      }))
    });

  } catch (error) {
    console.error('Get available students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting available students'
    });
  }
};