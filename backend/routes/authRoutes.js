const express = require('express');
const { registerUser, loginUser, changePassword, changeTeacherPassword } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for general password change (works for both students and teachers)
router.post('/change-password', changePassword);

// Route for teacher password change (kept for backward compatibility)
router.post('/change-teacher-password', changeTeacherPassword);

module.exports = router;
