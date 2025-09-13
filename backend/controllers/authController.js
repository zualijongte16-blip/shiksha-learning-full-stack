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
    registrationFee
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
  const { email, password } = req.body;
  const db = readDb();

  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Securely compare the submitted password with the stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  // --- This is the corrected part ---
  // 1. Create the JWT payload
  const payload = {
    user: {
      id: user.id,
      name: user.firstName
    }
  };

  // 2. Sign the token with a secret key
  jwt.sign(
    payload,
    process.env.JWT_SECRET, // IMPORTANT: Replace with a secret from an environment variable
    { expiresIn: '1h' }, // Token expires in 1 hour
    (err, token) => {
      if (err) throw err;
      // 3. Send the token and username to the frontend
      res.status(200).json({ token, username: user.firstName });
    }
  );
};