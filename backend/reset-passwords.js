const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath));

// Reset passwords for all students to 'password123'
const saltRounds = 10;
const hashedPassword = bcrypt.hashSync('password123', saltRounds);

db.users.forEach(user => {
  if (user.role === 'student') {
    user.password = hashedPassword;
    console.log('Reset password for:', user.email, 'to: password123');
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('All student passwords have been reset to: password123');
