require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const mongoose = require('mongoose');

async function checkPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}, 'email password role firstName lastName');
    console.log('\n=== USER CREDENTIALS ===\n');

    for (const user of users) {
      console.log(`Role: ${user.role.toUpperCase()}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password Hash: ${user.password}`);

      // Common passwords to try
      const commonPasswords = ['admin123', 'password', '123456', 'admin', 'superadmin', 'shiksha123'];

      console.log('Trying common passwords:');
      for (const pwd of commonPasswords) {
        const isMatch = await bcrypt.compare(pwd, user.password);
        if (isMatch) {
          console.log(`✅ Password found: ${pwd}`);
          break;
        } else {
          console.log(`❌ Not: ${pwd}`);
        }
      }
      console.log('---');
    }

    // Test login API
    console.log('\n=== TESTING LOGIN API ===\n');

    const testCredentials = [
      { email: 'admin@shiksha.com', password: 'admin123' },
      { email: 'superadmin@shiksha.com', password: 'admin123' },
      { email: 'admin@shiksha.com', password: 'password' },
      { email: 'superadmin@shiksha.com', password: 'password' }
    ];

    for (const cred of testCredentials) {
      try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cred)
        });

        const data = await response.text();
        console.log(`Login test - ${cred.email}:${cred.password}`);
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${data.substring(0, 100)}...`);
        console.log('---');
      } catch (error) {
        console.log(`Error testing ${cred.email}:`, error.message);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkPasswords();