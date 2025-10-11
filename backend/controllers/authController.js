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
      return res.status(400).json({ message: 'Invalid phone number format. Phone number must start with +91 or prefixes like 60, 811, etc. and be 10 digits long.' });
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

    // Create user with their chosen password
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
      tempPassword: false, // Not temporary - they set their own password
      isTemporaryPassword: false
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
      // Student login with email and password
      user = await User.findOne({ email: uniqueId, role: role });
      if (!user) {
        console.log('Login failed: Student not found for email:', uniqueId);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      if (user.tempPassword) {
        // For temporary password, check if it's "123456"
        if (password !== '123456') {
          console.log('Login failed: Invalid temporary password for student');
          return res.status(401).json({ message: 'Invalid password' });
        }
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match for student: ${isMatch}`);
        if (!isMatch) {
          console.log('Login failed: Invalid password for student');
          return res.status(401).json({ message: 'Invalid password' });
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
          mustChangePassword: false, // No force change - users login with their chosen password
          id: user._id // Add user ID for password changes
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
    const { email, teacherId, currentPassword, newPassword, userId, role } = req.body;

    let user;

    // Find user by multiple methods
    if (userId) {
      user = await User.findById(userId);
    } else if (teacherId) {
      user = await User.findOne({ teacherId });
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Email, Teacher ID, or User ID is required' });
    }

    if (!user) {
      console.log('User not found with provided credentials:', { email, teacherId, userId, role });
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user for password change:', { id: user._id, email: user.email, role: user.role, tempPassword: user.tempPassword });

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

// Forgot Password Function - Simplified (no email)
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    let user;

    // Find user by email and role
    user = await User.findOne({
      email: trimmedEmail,
      role: role
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found with this email address`
      });
    }

    // For forgot password, just return success - no OTP needed
    // The temporary password is always 123456
    const response = {
      success: true,
      message: 'Please use your temporary password 123456 to login, then you can change it.',
      tempPassword: '123456'
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

// New endpoint to verify OTP and reset password (Updated to use Email)
exports.verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { email, uniqueId, role, otp, newPassword } = req.body;

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
