const express = require('express');
const {
  getDashboardStats,
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllUsers,
  updateUserPermissions,
  createAdmin,
  getAllMaterials,
  getPayments,
  getReports,
  deactivateUser,
  activateUser
} = require('../controllers/superadminController');
const { verifyToken, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// All superadmin routes require authentication and superadmin role
router.use(verifyToken);
router.use(requireSuperAdmin);

// Dashboard and statistics
router.get('/stats', getDashboardStats);

// Student management (full permissions)
router.get('/students', getAllStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Teacher management (full permissions)
router.get('/teachers', getAllTeachers);
router.post('/teachers', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

// Course management (full permissions)
router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/permissions', updateUserPermissions);
router.post('/users/admin', createAdmin);
router.put('/users/:id/deactivate', deactivateUser);
router.put('/users/:id/activate', activateUser);

// Materials and payments (read-only for superadmin)
router.get('/materials', getAllMaterials);
router.get('/payments', getPayments);
router.get('/reports', getReports);

module.exports = router;