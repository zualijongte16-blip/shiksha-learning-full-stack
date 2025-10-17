require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const mongoose = require('mongoose');

async function testSuperAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const superadmin = await User.findOne({ role: 'superadmin' });
    console.log('Testing common passwords for SuperAdmin...');

    const commonPasswords = ['admin123', 'password', '123456', 'admin', 'superadmin', 'shiksha123', 'SA001', 'superadmin123'];

    for (const pwd of commonPasswords) {
      const isMatch = await bcrypt.compare(pwd, superadmin.password);
      console.log(`Testing '${pwd}': ${isMatch ? '✅ MATCH!' : '❌ No match'}`);
      if (isMatch) {
        console.log(`\n🎉 FOUND THE PASSWORD: ${pwd}`);
        break;
      }
    }

    console.log('\nSuperAdmin Details:');
    console.log('Email:', superadmin.email);
    console.log('Teacher ID:', superadmin.teacherId);
    console.log('Temp Password:', superadmin.tempPassword);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testSuperAdminPassword();