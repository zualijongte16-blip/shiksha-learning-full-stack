const express = require('express');

const { registerUser, loginUser, changePassword, changeTeacherPassword, resetPassword, verifyOtpAndResetPassword, forgotPassword, resetPasswordDirect, getUserResetAttempts, verifyEmail, forgotPasswordReset } = require('../controllers/authController');



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

// Route for direct password reset (development mode)
router.post('/reset-password-direct', resetPasswordDirect);

// Route to get user's password reset attempts count
router.get('/user-reset-attempts/:identifier', getUserResetAttempts);

// Route to verify email exists in system
router.post('/verify-email', verifyEmail);

// Route for forgot password reset after email verification
router.post('/forgot-password-reset', forgotPasswordReset);

module.exports = router;