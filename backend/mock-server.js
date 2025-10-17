const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const bcrypt = require('bcryptjs');


const app = express();
const PORT = 5001;

// Middleware
app.use(cors({

  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:5001',
    'http://127.0.0.1:5002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']

}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Mock data
let mockTeachers = [
  {
    _id: '1',
    id: 1,
    name: 'Teacher 2001',
    email: 'teacher.2001@shiksha.edu',
    teacherId: '2001',
    subjects: ['Mathematics', 'Science'],
    assignedClasses: ['Class 10A', 'Class 11B'],
    permissions: {
      canUploadMaterials: true,
      canCreateTests: true,
      canManageStudents: true

    }
  },
  {
    _id: '2',
    id: 2,
    name: 'Teacher 2002',
    email: 'teacher.2002@shiksha.edu',
    teacherId: '2002',
    subjects: ['English', 'History'],
    assignedClasses: ['Class 9A', 'Class 10B'],
    permissions: {
      canUploadMaterials: true,
      canCreateTests: true,
      canManageStudents: true

    }
  },
  {
    _id: '3',
    id: 3,
    name: 'John Doe',
    email: 'john@example.com',
    teacherId: 'T001',
    subjects: ['Math', 'Science'],
    assignedClasses: ['Class 10A'],
    permissions: {
      canUploadMaterials: true,
      canCreateTests: true,
      canManageStudents: true

    }
  }
];

let mockCourses = [
  {
    _id: '1',
    id: 1,
    name: 'Mathematics',
    description: 'Advanced Mathematics course',
    teacherId: '2001',
    enrolledStudents: [],
    progress: 75
  },
  {
    _id: '2',
    id: 2,
    name: 'Science',
    description: 'Physics and Chemistry',
    teacherId: '2001',
    enrolledStudents: [],
    progress: 60
  },
  {
    _id: '3',
    id: 3,
    name: 'English',
    description: 'English Literature and Grammar',
    teacherId: '2002',
    enrolledStudents: [],
    progress: 80
  }
];

let mockMaterials = [];
let mockTests = [];
let mockUsers = [
  {
    _id: 'sa1',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@shiksha.edu',
    phone: '1234567890',
    password: bcrypt.hashSync('pass123', 10),
    role: 'superadmin',
    userId: 'SA001',
    tempPassword: false
  },
  {
    _id: 'a1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@shiksha.edu',
    phone: '1234567891',
    password: bcrypt.hashSync('pass123', 10),
    role: 'admin',
    userId: 'A001',
    tempPassword: false
  },
  {
    _id: 't1',
    firstName: 'Teacher',
    lastName: 'One',
    email: 'teacher@shiksha.edu',
    phone: '1234567892',
    password: bcrypt.hashSync('pass123', 10),
    role: 'teacher',
    userId: 'T001',
    tempPassword: false
  }
];
let mockStudents = [];
// Clear any dynamically added students
mockUsers = mockUsers.filter(u => u.role !== 'student');

// Routes

// Login
app.post('/api/auth/login', (req, res) => {
  const { role, uniqueId, password } = req.body;

  if (role === 'teacher') {
    const user = mockUsers.find(u => u.role === 'teacher' && u.userId === uniqueId);
    if (user && bcrypt.compareSync(password, user.password)) {
      const teacher = mockTeachers.find(t => t.teacherId === uniqueId);
      res.json({
        token: 'mock-teacher-token',
        username: user.firstName + ' ' + user.lastName,
        role: 'teacher',
        tempPassword: user.tempPassword,
        teacherId: uniqueId,
        subject: teacher ? teacher.subjects[0] : 'Math',
        permissions: teacher ? teacher.permissions : {}
      });
    } else {
      res.status(401).json({ message: 'Invalid Teacher ID or password' });
    }
  } else if (role === 'student') {
    // Mock student login - check if student exists
    const student = mockUsers.find(u => u.email === uniqueId && u.role === 'student');
    if (student && bcrypt.compareSync(password, student.password)) {
      res.json({
        token: 'mock-student-token',
        username: student.firstName + ' ' + student.lastName,
        role: 'student',
        tempPassword: false,
        email: student.email,
        class: student.class
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } else if (role === 'superadmin') {
    const user = mockUsers.find(u => u.role === 'superadmin' && u.userId === uniqueId);
    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        token: 'mock-superadmin-token',
        username: user.firstName + ' ' + user.lastName,
        role: 'superadmin',
        tempPassword: user.tempPassword
      });
    } else {
      res.status(401).json({ message: 'Invalid SuperAdmin ID or password' });
    }
  } else if (role === 'admin') {
    const user = mockUsers.find(u => u.role === 'admin' && u.userId === uniqueId);
    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        token: 'mock-admin-token',
        username: user.firstName + ' ' + user.lastName,
        role: 'admin',
        tempPassword: user.tempPassword
      });
    } else {
      res.status(401).json({ message: 'Invalid Admin ID or password' });
    }
  } else {
    res.status(400).json({ message: 'Invalid role' });
  }
});

// Forgot Password - Request OTP
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    console.log('🚨 FORGOT PASSWORD ROUTE HIT!');
    const { identifier } = req.body;

    console.log('Forgot password request received:', { identifier });
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Find user by email or phone number
    let user = mockUsers.find(u => u.email === identifier || u.phone === identifier);

    console.log('User found:', user ? 'YES' : 'NO');
    console.log('Available users:', mockUsers.length);

    if (!user) {
      console.log('No user found with identifier:', identifier);
      return res.status(404).json({
        success: false,
        message: `No user found with email or phone number: ${identifier}`
      });
    }

    // Use fixed OTP for testing (as requested)
    const otp = '123456789'; // Fixed OTP for testing
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP to user (in production, store securely)
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    console.log(`OTP generated for ${user.email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `OTP sent to your registered contact. (Testing mode: OTP is ${otp})`,
      otp: otp, // Include OTP in development mode for testing
      otpExpiry: otpExpiry
    });
  } catch (error) {
    console.error('Error in forgot password route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Verify OTP and Reset Password
app.post('/api/auth/verify-otp-reset-password', (req, res) => {
  const { identifier, otp, newPassword } = req.body;

  console.log('OTP verification request:', { identifier, otp });

  // Find user by email or phone number
  let user = mockUsers.find(u => u.email === identifier || u.phone === identifier);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `No user found with provided email or phone number`
    });
  }

  // Check OTP validity
  if (!user.otp || !user.otpExpiry) {
    return res.status(400).json({
      success: false,
      message: 'No OTP found. Please request a new one.'
    });
  }

  if (user.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  }

  if (user.otpExpiry < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'OTP expired. Please request a new one.'
    });
  }

  // Update password and clear OTP
  user.password = bcrypt.hashSync(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;
  user.tempPassword = false;

  console.log(`Password reset successfully for ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. You can now login with your new password.'
  });
});

// Student registration
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, phone, class: classField, address, registrationFee, password } = req.body;

  console.log('Student registration attempt:', { firstName, lastName, email, phone });

  // Check if student already exists (by phone number - primary key, consistent with actual server)
  const existingStudent = mockUsers.find(u => u.phone === phone);
  if (existingStudent) {
    return res.status(400).json({
      message: 'User with this phone number already exists',
      existingUser: {
        name: `${existingStudent.firstName} ${existingStudent.lastName}`,
        email: existingStudent.email,
        phone: existingStudent.phone,
        class: existingStudent.class
      }
    });
  }

  // Create new student user
  const newStudent = {
    _id: Date.now().toString(),
    firstName,
    lastName,
    email,
    phone,
    class: classField,
    address,
    registrationFee: registrationFee || 1500,
    role: 'student',
    password: bcrypt.hashSync(password, 10), // Hash the password
    tempPassword: false,
    isActive: true
  };

  mockUsers.push(newStudent);

  // Also add to students collection for display
  const studentRecord = {
    _id: Date.now().toString(),
    name: `${firstName} ${lastName}`,
    email,
    class: classField,
    address,
    phone
  };

  mockStudents.push(studentRecord);

  console.log('Student registered successfully:', newStudent.email);

  res.status(201).json({
    message: 'Student registered successfully! You can now login with your email and password.',
    student: newStudent
  });
});

// Password change
app.post('/api/auth/change-password', (req, res) => {
  const { email, teacherId, currentPassword, newPassword, role } = req.body;

  // Validate current password (for temp passwords, it should match the unique ID)
  let expectedCurrentPassword = teacherId || email;

  if (currentPassword === expectedCurrentPassword) {
    // Password change successful
    res.json({ message: 'Password changed successfully' });
  } else {
    res.status(400).json({ message: 'Current password is incorrect' });
  }
});

// Get teacher data
app.get('/api/admin/teachers/:teacherId', (req, res) => {
  const teacher = mockTeachers.find(t => t.teacherId === req.params.teacherId);
  if (teacher) {
    res.json(teacher);
  } else {
    res.status(404).json({ message: 'Teacher not found' });
  }
});

// Get courses for teacher
app.get('/api/admin/courses', (req, res) => {
  const { teacherId } = req.query;
  if (teacherId) {
    const courses = mockCourses.filter(c => c.teacherId === teacherId);
    res.json(courses);
  } else {
    res.json(mockCourses);
  }
});

// Get materials for teacher
app.get('/api/materials/teacher/:teacherId', (req, res) => {
  const materials = mockMaterials.filter(m => m.teacherId === req.params.teacherId);
  res.json(materials);
});

// Upload material
app.post('/api/materials/upload', upload.single('materialFile'), (req, res) => {

  const { title, description, courseId, class: className, teacherId } = req.body;
  const fileUrl = `/uploads/${req.file.filename}`;

  // Find the teacher to check permissions
  const teacher = mockTeachers.find(t => t.teacherId === teacherId);
  if (!teacher) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  console.log(`Teacher ${teacherId} uploaded material for course ${courseId}, class ${className}`);


  const newMaterial = {
    id: Date.now().toString(),
    title,
    description,
    courseId,
    class: className,

    teacherId,
    fileUrl,
    uploadDate: new Date().toISOString()
  };

  mockMaterials.push(newMaterial);
  res.json({ message: 'Material uploaded successfully', material: newMaterial });
});

// Delete material
app.delete('/api/materials/:materialId', (req, res) => {
  const index = mockMaterials.findIndex(m => m.id === req.params.materialId);
  if (index > -1) {
    mockMaterials.splice(index, 1);
    res.json({ message: 'Material deleted successfully' });
  } else {
    res.status(404).json({ message: 'Material not found' });
  }
});

// Get tests for teacher
app.get('/api/tests/teacher/:teacherId', (req, res) => {
  const tests = mockTests.filter(t => t.teacherId === req.params.teacherId);
  res.json(tests);
});

// Create test
app.post('/api/tests', (req, res) => {
  const newTest = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };

  mockTests.push(newTest);
  res.json({ message: 'Test created successfully', test: newTest });
});

// Delete test
app.delete('/api/tests/:testId', (req, res) => {
  const index = mockTests.findIndex(t => t._id === req.params.testId);
  if (index > -1) {
    mockTests.splice(index, 1);
    res.json({ message: 'Test deleted successfully' });
  } else {
    res.status(404).json({ message: 'Test not found' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Mock authentication middleware for protected routes
const mockAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // Accept any token for testing purposes and determine role
    if (token && token.length > 0) {
      let userRole = 'user'; // default role
      if (token.includes('superadmin')) {
        userRole = 'superadmin';
      } else if (token.includes('admin')) {
        userRole = 'admin';
      } else if (token.includes('teacher')) {
        userRole = 'teacher';
      }
      req.user = { role: userRole, token: token };
      next();
    } else {
      res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
  } else {
    res.status(401).json({ message: 'Access denied. No token provided.' });
  }
};

// SuperAdmin routes for teacher creation
app.post('/api/superadmin/teachers', mockAuth, (req, res) => {
  const { name, email, teacherId, subjects } = req.body;

  // Check if teacher already exists
  const existingTeacher = mockTeachers.find(t => t.email === email || t.teacherId === teacherId);
  if (existingTeacher) {
    return res.status(400).json({ message: 'Teacher already exists' });
  }

  // Create new teacher
  const newTeacher = {
    _id: Date.now().toString(),
    id: mockTeachers.length + 1,
    name,
    email,
    teacherId,
    subjects: subjects || [],
    assignedClasses: [],
    permissions: {
      canUploadMaterials: true,
      canCreateTests: true,
      canManageStudents: true
    }
  };

  mockTeachers.push(newTeacher);

  // Create user entry for login
  const newUser = {
    _id: Date.now().toString(),
    firstName: name.split(' ')[0],
    lastName: name.split(' ').slice(1).join(' ') || '',
    email,
    password: bcrypt.hashSync(teacherId, 10), // Initial password is teacherId
    role: 'teacher',
    teacherId,
    tempPassword: true
  };

  mockUsers.push(newUser);

  res.status(201).json({ message: 'Teacher created successfully', teacher: newTeacher });
});

// Get all teachers (superadmin)
app.get('/api/superadmin/teachers', mockAuth, (req, res) => {
  res.json(mockTeachers);
});

// Get superadmin dashboard stats
app.get('/api/superadmin/stats', mockAuth, (req, res) => {
  const stats = {
    totalStudents: mockStudents.length,
    totalTeachers: mockTeachers.length,
    totalCourses: mockCourses.length,
    totalRevenue: 15000,
    activeCourses: mockCourses.filter(c => c.progress > 0).length,
    pendingPayments: 5,
    totalSignups: mockStudents.length,
    activeStudents: mockStudents.length,
    totalAdmins: 2
  };
  res.json(stats);
});

// Live call functionality
let activeCalls = [];

app.post('/api/calls/start', (req, res) => {
  const { teacherId, studentId, callType } = req.body;

  const callId = Date.now().toString();
  const newCall = {
    callId,
    teacherId,
    studentId,
    callType: callType || 'video',
    status: 'active',
    startTime: new Date().toISOString(),
    participants: [teacherId, studentId]
  };

  activeCalls.push(newCall);

  console.log(`Call started: ${teacherId} -> ${studentId}, Call ID: ${callId}`);

  res.json({
    message: 'Call started successfully',
    callId,
    callData: newCall
  });
});

app.post('/api/calls/end', (req, res) => {
  const { callId } = req.body;

  const callIndex = activeCalls.findIndex(call => call.callId === callId);
  if (callIndex > -1) {
    activeCalls[callIndex].status = 'ended';
    activeCalls[callIndex].endTime = new Date().toISOString();

    console.log(`Call ended: ${callId}`);

    res.json({ message: 'Call ended successfully' });
  } else {
    res.status(404).json({ message: 'Call not found' });
  }
});

app.get('/api/calls/active/:userId', (req, res) => {
  const { userId } = req.params;

  const userCalls = activeCalls.filter(call =>
    call.participants.includes(userId) && call.status === 'active'
  );

  res.json(userCalls);
});

app.get('/api/calls/history/:userId', (req, res) => {
  const { userId } = req.params;

  const userCallHistory = activeCalls.filter(call =>
    call.participants.includes(userId)
  );

  res.json(userCallHistory);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Mock server running', timestamp: new Date().toISOString() });
});

// Test endpoint for forgot password
app.get('/api/test-forgot-password', (req, res) => {
  res.json({
    message: 'Forgot password endpoint is registered',
    availableRoutes: ['POST /api/auth/forgot-password', 'POST /api/auth/verify-otp-reset-password'],
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log(`📁 Serving uploads from: ${uploadsDir}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👨‍🏫 SuperAdmin teacher creation: http://localhost:${PORT}/api/superadmin/teachers`);

});