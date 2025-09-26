const fs = require('fs'); // [cite: 3]
const path = require('path'); // [cite: 4]
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For creating tokens

const dbPath = path.join(__dirname, '../data/db.json'); // [cite: 5]

// Helper function to read the database file [cite: 6]
const readDb = () => {
  const data = fs.readFileSync(dbPath); // [cite: 7]
  return JSON.parse(data); // [cite: 8]
};

// Helper function to write to the database file [cite: 10]
const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); // [cite: 11]
};


//registration{changed}
exports.registerUser = async (req, res) => {
  const { email, password, firstName, lastName, class: classField, course, address, phone, registrationFee } = req.body;
  const db = readDb();

  if (db.users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    id: db.users.length + 1,
    firstName,
    lastName,
    email,
    password: hashedPassword, // Save the hashed password
    class: classField,
    address,
    phone,
    registrationFee,
    role: 'student' // Assign student role by default for regular signups
  };

  const newStudent = {
    id: db.students.length + 1,
    name: `${firstName} ${lastName}`,
    email,
    course,
    class: classField,
    address,
    phone
  };

  db.users.push(newUser);
  db.students.push(newStudent);
  writeDb(db);

  res.status(201).json({ message: 'User registered successfully' });
};



// --- CORRECTED LOGIN ---{changed}
exports.loginUser = async (req, res) => {
  const { email, password, uniqueId, role } = req.body;
  const db = readDb();

  let user;

  if (role === 'teacher' && uniqueId) {
    // Teacher login with unique ID and password
    user = db.users.find(u => u.role === 'teacher' && u.teacherId === uniqueId);
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
    user = db.users.find(u => u.email === email);
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
      id: user.id,
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
};

// General password change function for both students and teachers
exports.changePassword = async (req, res) => {
  const { email, teacherId, currentPassword, newPassword } = req.body;
  const db = readDb();

  let user;

  // Find user by email (for students) or teacherId (for teachers)
  if (teacherId) {
    user = db.users.find(u => u.teacherId === teacherId);
  } else if (email) {
    user = db.users.find(u => u.email === email);
  } else {
    return res.status(400).json({ message: 'Email or Teacher ID is required' });
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify current password
  let isCurrentPasswordValid = false;

  // Check if user has a temporary password (for teachers initially)
  if (user.tempPassword !== false && user.role === 'teacher') {
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
  if (user.hasOwnProperty('tempPassword')) {
    user.tempPassword = false;
  }

  // Write back to database
  writeDb(db);

  res.status(200).json({ message: 'Password changed successfully' });
};

// Teacher password change function (kept for backward compatibility)
exports.changeTeacherPassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const db = readDb();

  const user = db.users.find(u => u.email === email && u.role === 'teacher');
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

  // Write back to database
  writeDb(db);

  res.status(200).json({ message: 'Password changed successfully' });
};
