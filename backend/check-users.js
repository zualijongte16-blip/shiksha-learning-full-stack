require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas\n');

    const users = await User.find({});
    console.log('Total users in database:', users.length);
    console.log('\nAll users:');

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Teacher ID: ${user.teacherId}`);
      console.log(`   Active: ${user.isActive}`);
      console.log('---');
    });

    const adminUsers = await User.find({ role: { $in: ['admin', 'superadmin'] } });
    console.log(`\nAdmin/SuperAdmin users found: ${adminUsers.length}`);

    if (adminUsers.length > 0) {
      adminUsers.forEach(user => {
        console.log(`- ${user.role}: ${user.email} (ID: ${user.teacherId})`);
      });
    } else {
      console.log('No admin or superadmin users found in database');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkUsers();