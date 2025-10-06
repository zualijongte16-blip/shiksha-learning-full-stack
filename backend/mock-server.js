const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true
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
      canManageStudents: false
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
      canManageStudents: false
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
      canManageStudents: false
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

// Routes

// Login
app.post('/api/auth/login', (req, res) => {
  const { role, uniqueId, password } = req.body;

  if (role === 'teacher') {
    const teacher = mockTeachers.find(t => t.teacherId === uniqueId);
    if (teacher && password === uniqueId) { // Simple password check
      res.json({
        token: 'mock-jwt-token',
        username: teacher.name,
        role: 'teacher',
        tempPassword: password === uniqueId, // If password matches ID, it's temp
        teacherId: uniqueId,
        subject: teacher.subjects[0]
      });
    } else {
      res.status(401).json({ message: 'Invalid Teacher ID or password' });
    }
  } else if (role === 'student') {
    // Mock student login
    res.json({
      token: 'mock-jwt-token',
      username: 'Student User',
      role: 'student',
      tempPassword: false
    });
  } else {
    res.status(400).json({ message: 'Invalid role' });
  }
});

// Password change
app.post('/api/auth/change-password', (req, res) => {
  // Mock password change - always succeeds
  res.json({ message: 'Password changed successfully' });
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
  const { title, description, courseId, teacherId } = req.body;
  const fileUrl = `/uploads/${req.file.filename}`;

  const newMaterial = {
    id: Date.now().toString(),
    title,
    description,
    courseId,
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Mock server running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log(`📁 Serving uploads from: ${uploadsDir}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});