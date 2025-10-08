require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const mongoose = require('mongoose');

async function testAdminAPI() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@shiksha.com' });
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    // Create token
    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Admin token:', token);

    // Test API endpoint
    const response = await fetch('http://localhost:5001/api/admin/teachers', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('Response status:', response.status);
    const data = await response.text();
    console.log('Response body:', data);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testAdminAPI();