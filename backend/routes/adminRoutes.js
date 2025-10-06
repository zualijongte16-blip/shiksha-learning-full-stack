const express = require('express');
const { getDashboardStats, getAllStudents, getAllTeachers, getTeacherById, getAllCourses, getAllUsers, getAllMaterials, getPayments, getReports, createStudent, updateStudent, deleteStudent, createTeacher, updateTeacher, deleteTeacher, createCourse, updateCourse, deleteCourse } = require('../controllers/adminController');

const router = express.Router();

// Middleware to check if user is admin (placeholder - implement JWT verification)
const verifyAdmin = (req, res, next) => {
  // TODO: Verify JWT token and check if role is 'admin'
  next(); // For now, allow all
};

// Get dashboard statistics
router.get('/stats', verifyAdmin, getDashboardStats);

// Get all students
router.get('/students', verifyAdmin, getAllStudents);

// Create student
router.post('/students', verifyAdmin, createStudent);

// Update student
router.put('/students/:id', verifyAdmin, updateStudent);

// Delete student
router.delete('/students/:id', verifyAdmin, deleteStudent);

// Get all teachers
router.get('/teachers', verifyAdmin, getAllTeachers);

// Get teacher by ID
router.get('/teachers/:id', verifyAdmin, getTeacherById);

// Create teacher
router.post('/teachers', verifyAdmin, createTeacher);

// Update teacher
router.put('/teachers/:id', verifyAdmin, updateTeacher);

// Delete teacher
router.delete('/teachers/:id', verifyAdmin, deleteTeacher);

// Get all courses
router.get('/courses', verifyAdmin, getAllCourses);

// Create course
router.post('/courses', verifyAdmin, createCourse);

// Update course
router.put('/courses/:id', verifyAdmin, updateCourse);

// Delete course
router.delete('/courses/:id', verifyAdmin, deleteCourse);

// Get all users
router.get('/users', verifyAdmin, getAllUsers);

// Get all materials
router.get('/materials', verifyAdmin, getAllMaterials);

// Get payments
router.get('/payments', verifyAdmin, getPayments);

// Get reports
router.get('/reports', verifyAdmin, getReports);

module.exports = router;
