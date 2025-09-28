const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For creating tokens
const User = require('../models/User');
const Student = require('../models/Student');


//registration{changed}
exports.registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, class: classField, course, address, phone, registrationFee } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
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
      phone,
      registrationFee,
      role: 'student'
    });
    await newUser.save();

    // Create student
    const newStudent = new Student({
      name: `${firstName} ${lastName}`,
      email,
      course,
      class: classField,
      address,
      phone
    });
    await newStudent.save();

    res.status(201).json({ message: 'User registered successfully' });
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

    if (role === 'teacher' && uniqueId) {
      // Teacher login with unique ID and password
      user = await User.findOne({ role: 'teacher', teacherId: uniqueId });
      if (!user) {
        return res.status(401).json({ message: 'Invalid Teacher ID' });
      }

      // Check if teacher has a temporary password (teacherId as password)
      if (user.tempPassword !== false) {
        // Temporary password is the teacherId itself
        if (password !== uniqueId) {
          return res.status(401).json({ message: 'Invalid password' });
        }
      } else {
        // Teacher has changed password, use bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid password' });
        }
      }
    } else if (role === 'student' || role === 'admin') {
      // Student or Admin login with email and password
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // For regular users and teachers with changed passwords, use bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
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
        if (err) throw err;
        // 3. Send the token and username to the frontend
        res.status(200).json({
          token,
          username: user.firstName,
          role: user.role,
          tempPassword: user.tempPassword,
          subject: user.subject || 'Not assigned'
        });
      }
    );
  } catch (error) {
    console.error(error);
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
