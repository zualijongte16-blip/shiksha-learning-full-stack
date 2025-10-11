require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createDefaultUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    const saltRounds = 10;

    // Create default Teacher
    const teacherExists = await User.findOne({ teacherId: 'T001', role: 'teacher' });
    if (!teacherExists) {
      const teacherPassword = await bcrypt.hash('teacher123', saltRounds);
      const teacher = new User({
        firstName: 'Default',
        lastName: 'Teacher',
        email: 'teacher@shiksha.com',
        password: teacherPassword,
        role: 'teacher',
        teacherId: 'T001',
        tempPassword: false,
        isActive: true
      });
      await teacher.save();
      console.log('Default Teacher created: ID T001, Password teacher123');
    } else {
      console.log('Default Teacher already exists');
    }

    // Create default Admin
    const adminExists = await User.findOne({ teacherId: 'A001', role: 'admin' });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', saltRounds);
      const admin = new User({
        firstName: 'Default',
        lastName: 'Admin',
        email: 'admin@shiksha.com',
        password: adminPassword,
        role: 'admin',
        teacherId: 'A001',
        tempPassword: false,
        isActive: true
      });
      await admin.save();
      console.log('Default Admin created: ID A001, Password admin123');
    } else {
      console.log('Default Admin already exists');
    }

    // Create default Superadmin
    const superadminExists = await User.findOne({ teacherId: 'SA001', role: 'superadmin' });
    if (!superadminExists) {
      const superadminPassword = await bcrypt.hash('super123', saltRounds);
      const superadmin = new User({
        firstName: 'Default',
        lastName: 'Superadmin',
        email: 'superadmin@shiksha.com',
        password: superadminPassword,
        role: 'superadmin',
        teacherId: 'SA001',
        tempPassword: false,
        isActive: true
      });
      await superadmin.save();
      console.log('Default Superadmin created: ID SA001, Password super123');
    } else {
      console.log('Default Superadmin already exists');
    }

    console.log('Default users creation completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating default users:', error);
    process.exit(1);
  }
};

createDefaultUsers();
