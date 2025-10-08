require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const mongoose = require('mongoose');

async function createSuperAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get user input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = (question) => {
      return new Promise((resolve) => {
        rl.question(question, resolve);
      });
    };

    console.log('\n🚀 SuperAdmin User Creation Script');
    console.log('================================\n');

    const firstName = await askQuestion('Enter first name: ');
    const lastName = await askQuestion('Enter last name: ');
    const email = await askQuestion('Enter email: ');
    const password = await askQuestion('Enter password: ');
    const superadminId = await askQuestion('Enter SuperAdmin ID (e.g., SA002): ');

    rl.close();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists with this email!');
      return;
    }

    // Hash the SuperAdmin ID as the initial password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(superadminId, salt);

    // Create SuperAdmin user with all permissions
    const newSuperAdmin = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'superadmin',
      teacherId: superadminId,
      registrationFee: 0,
      isActive: true,
      tempPassword: true, // Force password change on first login
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
      }
    });

    await newSuperAdmin.save();

    console.log('\n🎉 SuperAdmin User Created Successfully!');
    console.log('=====================================');
    console.log(`✅ Name: ${firstName} ${lastName}`);
    console.log(`✅ Email: ${email}`);
    console.log(`✅ Role: superadmin`);
    console.log(`✅ SuperAdmin ID: ${superadminId}`);
    console.log(`✅ Status: Active`);
    console.log(`✅ All Permissions: Granted`);
    console.log('\n🔐 Initial Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Initial Password: ${superadminId}`);
    console.log('\n⚠️  IMPORTANT:');
    console.log(`   • Initial password is your SuperAdmin ID: "${superadminId}"`);
    console.log(`   • You MUST change this password on first login`);
    console.log(`   • After login, you'll be redirected to change your password`);
    console.log(`   • Choose a strong, secure password`);
    console.log('\n📝 Next Steps:');
    console.log(`   1. Go to http://localhost:3000/login`);
    console.log(`   2. Login with the credentials above`);
    console.log(`   3. Change your password when prompted`);
    console.log(`   4. Access SuperAdmin dashboard`);

  } catch (error) {
    console.error('❌ Error creating SuperAdmin user:', error.message);
  } finally {
    process.exit(0);
  }
}

// Run the script
createSuperAdminUser();