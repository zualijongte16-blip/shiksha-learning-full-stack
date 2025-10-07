const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create SuperAdmin user
const createSuperAdmin = async () => {
  try {
    await connectDB();

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('SuperAdmin already exists:', existingSuperAdmin.email);
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('superadmin123', salt);

    // Create SuperAdmin user
    const superAdmin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@shiksha.com',
      password: hashedPassword,
      role: 'superadmin',
      teacherId: 'SA001', // SuperAdmin unique ID
      permissions: {
        canCreateStudent: true,
        canEditStudent: true,
        canDeleteStudent: true,
        canCreateTeacher: true,
        canEditTeacher: true,
        canDeleteTeacher: true,
        canCreateCourse: true,
        canEditCourse: true,
        canDeleteCourse: true,
        canViewReports: true,
        canManagePermissions: true,
        canViewProgress: true
      },
      isActive: true
    });

    await superAdmin.save();
    console.log('SuperAdmin created successfully!');
    console.log('Email: superadmin@shiksha.com');
    console.log('Password: superadmin123');
    console.log('Role: superadmin');

  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Create Admin user
const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@shiksha.com' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create Admin user
    const admin = new User({
      firstName: 'Progress',
      lastName: 'Admin',
      email: 'admin@shiksha.com',
      password: hashedPassword,
      role: 'admin',
      teacherId: 'AD001', // Admin unique ID
      permissions: {
        canCreateStudent: false,
        canEditStudent: false,
        canDeleteStudent: false,
        canCreateTeacher: false,
        canEditTeacher: false,
        canDeleteTeacher: false,
        canCreateCourse: false,
        canEditCourse: false,
        canDeleteCourse: false,
        canViewReports: true,
        canManagePermissions: false,
        canViewProgress: true
      },
      isActive: true
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email: admin@shiksha.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating Admin:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run functions sequentially
const runSetup = async () => {
  await createAdmin();
  await createSuperAdmin();
};

runSetup();