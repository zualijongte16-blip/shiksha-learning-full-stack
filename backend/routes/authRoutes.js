const express = require('express');
const { registerUser, loginUser, changePassword, changeTeacherPassword, resetPassword, verifyOtpAndResetPassword, forgotPassword } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for general password change (works for both students and teachers)
router.post('/change-password', changePassword);

// Route for teacher password change (kept for backward compatibility)
router.post('/change-teacher-password', changeTeacherPassword);

// Route for password reset (send OTP)
router.post('/reset-password', resetPassword);

// Route for forgot password (send OTP) - matches frontend endpoint
router.post('/forgot-password', forgotPassword);

// Route for OTP verification and password reset
router.post('/verify-otp-reset-password', verifyOtpAndResetPassword);

module.exports = router;
