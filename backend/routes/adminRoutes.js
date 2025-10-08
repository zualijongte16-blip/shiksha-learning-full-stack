const express = require('express');
const { getDashboardStats, getAllStudents, getAllTeachers, getTeacherById, getAllCourses, getAllUsers, getAllMaterials, getPayments, getReports, createStudent, updateStudent, deleteStudent, createTeacher, updateTeacher, deleteTeacher, createCourse, updateCourse, deleteCourse } = require('../controllers/adminController');
const { verifyToken, checkPasswordChange, requireAdmin, requirePermission } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(checkPasswordChange);
router.use(requireAdmin);

// Get dashboard statistics (admin can view progress stats)
router.get('/stats', getDashboardStats);

// Get all students (admin can view for progress tracking)
router.get('/students', getAllStudents);

// Admin cannot create students
router.post('/students', createStudent);

// Admin cannot update students
router.put('/students/:id', updateStudent);

// Admin cannot delete students
router.delete('/students/:id', deleteStudent);

// Get all teachers (admin can view for progress tracking)
router.get('/teachers', getAllTeachers);

// Get teacher by ID (admin can view for progress tracking)
router.get('/teachers/:id', getTeacherById);

// Admin cannot create teachers
router.post('/teachers', createTeacher);

// Admin cannot update teachers
router.put('/teachers/:id', updateTeacher);

// Admin cannot delete teachers
router.delete('/teachers/:id', deleteTeacher);

// Get all courses (admin can view for progress tracking)
router.get('/courses', getAllCourses);

// Admin cannot create courses
router.post('/courses', createCourse);

// Admin cannot update courses
router.put('/courses/:id', updateCourse);

// Admin cannot delete courses
router.delete('/courses/:id', deleteCourse);

// Get all users (admin can view for progress tracking)
router.get('/users', getAllUsers);

// Get all materials (admin can view for progress tracking)
router.get('/materials', getAllMaterials);

// Get payments (admin can view for progress tracking)
router.get('/payments', getPayments);

// Get reports (admin can view for progress tracking)
router.get('/reports', getReports);

module.exports = router;
