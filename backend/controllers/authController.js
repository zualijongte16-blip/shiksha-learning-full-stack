const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For creating tokens
const User = require('../models/User');
const Student = require('../models/Student');
const { isValidIndianPhoneNumber, formatIndianPhoneNumber } = require('../utils/phoneUtils');

//registration{changed}
exports.registerUser = async (req, res) => {
  try {
    const { email, firstName, lastName, class: classField, course, address, phone, registrationFee, password } = req.body;

    // Validate phone number
    if (!phone || !isValidIndianPhoneNumber(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format. Phone number must be exactly 10 digits.' });
    }

    // Format phone number to standard format
    const formattedPhone = formatIndianPhoneNumber(phone);
    if (!formattedPhone) {
      return res.status(400).json({ message: 'Phone number could not be formatted correctly.' });
    }


    // Check if user already exists (by phone number or email)
    const existingUserByPhone = await User.findOne({ phone: formattedPhone });
    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByPhone) {
      return res.status(400).json({
        message: 'User with this phone number already exists',
        existingUser: {
          phone: existingUserByPhone.phone,
          name: `${existingUserByPhone.firstName} ${existingUserByPhone.lastName}`,
          email: existingUserByPhone.email
        }
      });
    }

    if (existingUserByEmail) {
      return res.status(400).json({
        message: 'User with this email address already exists',
        existingUser: {
          phone: existingUserByEmail.phone,
          name: `${existingUserByEmail.firstName} ${existingUserByEmail.lastName}`,
          email: existingUserByEmail.email
        }
      });

    }

    // Hash the provided password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      class: classField,
      address,
      phone: formattedPhone,
      registrationFee,
      role: 'student',
      tempPassword: false // Not temporary
    });
    await newUser.save();

    // Create student (generate unique id)
    const lastStudent = await Student.findOne().sort({ id: -1 });
    const newId = lastStudent ? lastStudent.id + 1 : 1;
    const newStudent = new Student({
      id: newId,
      name: `${firstName} ${lastName}`,
      email,
      course: course || 'Not assigned', // Default value if course not provided
      class: classField,
      address,
      phone: formattedPhone
    });
    await newStudent.save();

    res.status(201).json({ message: 'User registered successfully. Please login with your email and password.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- CORRECTED LOGIN ---{changed}
exports.loginUser = async (req, res) => {
  try {
    const { email, password, uniqueId, role } = req.body;

    let user;

    console.log(`Login attempt: role=${role}, email=${email}, uniqueId=${uniqueId}`);

    if (role === 'teacher' && uniqueId) {
      // Teacher login with unique ID and password
      user = await User.findOne({ role: 'teacher', teacherId: uniqueId });
      if (!user) {
        console.log('Login failed: Invalid Teacher ID');
        return res.status(401).json({ message: 'Invalid Teacher ID' });
      }

      // Check if teacher has a temporary password (teacherId as password)
      if (user.tempPassword !== false) {
        // Temporary password is the teacherId itself
        if (password !== uniqueId) {
          console.log('Login failed: Invalid password for teacher with tempPassword');
          return res.status(401).json({ message: 'Invalid password' });
        }
      } else {
        // Teacher has changed password, use bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match for teacher: ${isMatch}`);
        if (!isMatch) {
          console.log('Login failed: Invalid password for teacher');
          return res.status(401).json({ message: 'Invalid password' });
        }
      }
    } else if (role === 'student') {
       // Student login with email - look in users collection first
       user = await User.findOne({ email: uniqueId, role: 'student' });

       if (!user) {
         console.log('Student not found in users collection, checking students collection for email:', uniqueId);

         // If not found in users collection, check students collection
         const student = await Student.findOne({ email: uniqueId });
         if (!student) {
           console.log('Login failed: Student not found for email:', uniqueId);
           return res.status(401).json({ message: 'Invalid email or password' });
         }

         // Student exists in students collection but not in users collection
         // Create user entry for login
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

         user = new User({
           firstName: student.name.split(' ')[0] || 'Student',
           lastName: student.name.split(' ')[1] || '',
           email: student.email,
           password: hashedPassword,
           role: 'student',
           phone: student.phone,
           class: student.class,
           tempPassword: false
         });
         await user.save();
         console.log('Created new user entry for existing student:', uniqueId);
       }

       // Check password based on tempPassword status
       if (user.tempPassword) {
         // For users with tempPassword, check against phone number
         if (password !== user.phone) {
           console.log('Login failed: Invalid password for student with tempPassword');
           return res.status(401).json({ message: 'Please use your phone number as password' });
         }
       } else {
         // For users with regular password, use bcrypt comparison
         const isMatch = await bcrypt.compare(password, user.password);
         console.log(`Password match for student: ${isMatch}`);
         if (!isMatch) {
           console.log('Login failed: Invalid password for student');
           return res.status(401).json({ message: 'Invalid email or password' });
         }
       }
    } else if (role === 'admin' || role === 'superadmin') {
      // Admin and SuperAdmin login with unique ID and password
      user = await User.findOne({ teacherId: uniqueId, role: role });
      if (!user) {
        console.log('Login failed: User not found for unique ID:', uniqueId);
        return res.status(401).json({ message: 'Invalid unique ID or password' });
      }

      // Check if user has temporary password
      if (user.tempPassword) {
        // For admin/superadmin: temporary password is their unique ID
        if (password !== user.teacherId) {
          console.log('Login failed: Invalid password for user with tempPassword');
          return res.status(401).json({ message: 'Invalid password' });
        }
      } else {
        // User has changed password, use bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match for user: ${isMatch}`);
        if (!isMatch) {
          console.log('Login failed: Password mismatch for user:', uniqueId);
          return res.status(401).json({ message: 'Invalid unique ID or password' });
        }
      }
    } else {
      console.log('Login failed: Invalid role');
      return res.status(400).json({ message: 'Invalid role' });
    }

    // --- This is the corrected part ---
    // 1. Create the JWT payload
    const payload = {
      user: {
        id: user._id,
        name: user.firstName,
        role: user.role,
        teacherId: user.teacherId
      }
    };

    // 2. Sign the token with a secret key
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key', // IMPORTANT: Replace with a secret from an environment variable
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        // 3. Send the token and username to the frontend
        res.status(200).json({
          token,
          username: user.firstName,
          role: user.role,
          tempPassword: user.tempPassword,
          uniqueId: user.teacherId,
          subject: user.subject || 'Not assigned',
          mustChangePassword: user.tempPassword
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// General password change function for both students and teachers
exports.changePassword = async (req, res) => {
  try {
    const { email, teacherId, currentPassword, newPassword } = req.body;

    let user;

    // Find user by email (for students) or teacherId (for teachers)
    if (teacherId) {
      user = await User.findOne({ teacherId });
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Email or Teacher ID is required' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    let isCurrentPasswordValid = false;

    // Check if user has a temporary password (for teachers initially)
    if (user.tempPassword && user.role === 'teacher') {
      isCurrentPasswordValid = currentPassword === user.teacherId;
    } else {
      // Use bcrypt for hashed passwords
      isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    }

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and remove tempPassword flag if it exists
    user.password = hashedPassword;
    user.tempPassword = false;

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher password change function (kept for backward compatibility)
exports.changeTeacherPassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const user = await User.findOne({ email, role: 'teacher' });
    if (!user) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Verify current password (either temp password or hashed password)
    let isCurrentPasswordValid = false;
    if (user.tempPassword) {
      isCurrentPasswordValid = currentPassword === user.teacherId;
    } else {
      isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    }

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and remove tempPassword flag
    user.password = hashedPassword;
    user.tempPassword = false;

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const crypto = require('crypto');
const sendSms = require('../utils/smsService'); // hypothetical SMS service utility

// Password Reset Function with OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, uniqueId, role, phone } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    let user;

    if (role === 'teacher') {
      if (!uniqueId || !uniqueId.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID is required'
        });
      }

      user = await User.findOne({
        role: 'teacher',
        teacherId: uniqueId.trim()
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Teacher ID not found'
        });
      }

    } else if (role === 'admin' || role === 'student' || role === 'superadmin') {
      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: `${role.charAt(0).toUpperCase() + role.slice(1)} email is required`
        });
      }

      user = await User.findOne({
        email: email.trim(),
        role: role
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `${role.charAt(0).toUpperCase() + role.slice(1)} email not found`
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Generate OTP
    let otp;
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      // Development mode: use fixed OTP for testing
      otp = '123456';
    } else {
      otp = crypto.randomInt(100000, 999999).toString();
    }
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP and expiry to user
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via SMS to user's phone number
    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: 'User phone number not found for sending OTP'
      });
    }

    const smsResult = await sendSms(user.phone, `Your OTP for password reset is: ${otp}`);

    if (!smsResult.success) {
      console.error('SMS sending failed:', {
        phone: user.phone,
        error: smsResult.error,
        fullError: smsResult.fullError
      });
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP SMS. Please check your phone number and try again.'
      });
    }

    // In development mode, include OTP in response for testing
    const response = {
      success: true,
      message: 'OTP sent to your registered phone number. Please verify to reset your password.'
    };

    if (smsResult.otp) {
      response.otp = smsResult.otp; // Include OTP for development/testing
      response.message += ` (Development mode: OTP is ${smsResult.otp})`;
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Forgot Password Function (matches frontend endpoint)
exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }

    const trimmedIdentifier = identifier.trim();
    let user;

    // Try to find user by email first
    user = await User.findOne({ email: trimmedIdentifier });

    // If not found by email, try by phone number
    if (!user) {
      user = await User.findOne({ phone: trimmedIdentifier });
    }

    // If still not found, try by teacherId
    if (!user) {
      user = await User.findOne({ teacherId: trimmedIdentifier });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email, phone number, or ID'
      });
    }

    // Check if user has exceeded reset attempts (3 times limit)
    if (user.passwordResetAttempts >= 3) {
      return res.status(403).json({
        success: false,
        message: 'Password reset limit exceeded. You can only reset your password 3 times. Please contact administrator.'
      });
    }

    // For offline mode, we'll just show the static verification code
    const response = {
      success: true,
      message: 'Your verification code is: 12345',
      userId: user._id
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Direct password reset without OTP (for development/testing)
exports.resetPasswordDirect = async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    const trimmedIdentifier = identifier.trim();
    let user;

    // Try to find user by email first
    user = await User.findOne({ email: trimmedIdentifier });

    // If not found by email, try by phone number
    if (!user) {
      user = await User.findOne({ phone: trimmedIdentifier });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email or phone number'
      });
    }

    // Check password reset attempts limit
    if (user.passwordResetAttempts >= 3) {
      return res.status(403).json({
        success: false,
        message: 'Password reset limit exceeded. You can only reset your password 3 times. Please contact administrator for further assistance.'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and increment reset attempts counter
    user.password = hashedPassword;
    user.tempPassword = false;
    user.otp = null;
    user.otpExpiry = null;
    user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;
    await user.save();

    console.log(`Password reset successful for user: ${user.email || user.phone}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Direct password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user's password reset attempts count
exports.getUserResetAttempts = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }

    const trimmedIdentifier = identifier.trim();
    let user;

    // Try to find user by email first
    user = await User.findOne({ email: trimmedIdentifier });

    // If not found by email, try by phone number
    if (!user) {
      user = await User.findOne({ phone: trimmedIdentifier });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      passwordResetAttempts: user.passwordResetAttempts || 0,
      maxAttempts: 3,
      remainingAttempts: Math.max(0, 3 - (user.passwordResetAttempts || 0))
    });

  } catch (error) {
    console.error('Get user reset attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Endpoint to verify code and reset password
exports.verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    let user;

    // Try to find user by email, phone, or teacherId
    user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        { teacherId: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check password reset attempts
    if (user.passwordResetAttempts >= 3) {
      return res.status(403).json({
        success: false,
        message: 'Password reset limit exceeded. Please contact administrator.'
      });
    }

    // Verify the static code (12345)
    if (otp !== '12345') {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    user.tempPassword = false;
    user.isTemporaryPassword = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Verify OTP and reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Endpoint to verify if email exists in the system
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    let user;

    // Try to find user by email in users collection
    user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      // If not found in users collection, check students collection
      const Student = require('../models/Student');
      const student = await Student.findOne({ email: trimmedEmail });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Email not found in our system'
        });
      }

      // Student exists but no user account - create basic user info for response
      return res.status(200).json({
        success: true,
        exists: true,
        role: 'student',
        message: 'Email found. Please proceed to reset your password.'
      });
    }

    // User found in users collection
    return res.status(200).json({
      success: true,
      exists: true,
      role: user.role,
      message: 'Email verified successfully. Please enter your new password.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Endpoint to reset password after email verification
exports.forgotPasswordReset = async (req, res) => {
  try {
    const { email, newPassword, role } = req.body;

    if (!email || !newPassword || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, new password, and role are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    let user;

    // Find user by email and role
    user = await User.findOne({ email: trimmedEmail, role: role });

    if (!user) {
      // If not found in users collection, check if it's a student
      if (role === 'student') {
        const Student = require('../models/Student');
        const student = await Student.findOne({ email: trimmedEmail });

        if (!student) {
          return res.status(404).json({
            success: false,
            message: 'Email not found in our system'
          });
        }

        // Create user account for existing student
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user = new User({
          firstName: student.name.split(' ')[0] || 'Student',
          lastName: student.name.split(' ')[1] || '',
          email: student.email,
          password: hashedPassword,
          role: 'student',
          phone: student.phone,
          class: student.class,
          tempPassword: false
        });

        await user.save();

        return res.status(200).json({
          success: true,
          message: 'Password set successfully. You can now login with your new password.'
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Email not found in our system'
        });
      }
    }

    // Check password reset attempts limit
    if (user.passwordResetAttempts >= 3) {
      return res.status(403).json({
        success: false,
        message: 'Password reset limit exceeded. You can only reset your password 3 times. Please contact administrator for further assistance.'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and increment reset attempts counter
    user.password = hashedPassword;
    user.tempPassword = false;
    user.otp = null;
    user.otpExpiry = null;
    user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;
    await user.save();

    console.log(`Password reset successful for user: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Forgot password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
