const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
require('dotenv').config({ path: __dirname + '/.env' });

/**
 * Script to add a new teacher to the system
 *
 * Usage: node add-new-teacher.js "Teacher Name" "T001" "Mathematics,Science"
 *
 * Parameters:
 * 1. Full Name (e.g., "John Smith")
 * 2. Teacher ID (e.g., "T001")
 * 3. Subjects (comma-separated, e.g., "Mathematics,Science,English")
 */

const addNewTeacher = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connected');

    // Get command line arguments
    const [,, fullName, teacherId, subjectsString] = process.argv;

    if (!fullName || !teacherId) {
      console.log('❌ Usage: node add-new-teacher.js "Full Name" "TeacherID" "Subject1,Subject2"');
      console.log('Example: node add-new-teacher.js "John Smith" "T003" "Mathematics,Physics"');
      process.exit(1);
    }

    const subjects = subjectsString ? subjectsString.split(',').map(s => s.trim()) : ['Mathematics'];
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || teacherId;

    console.log(`👨‍🏫 Adding new teacher: ${fullName} (ID: ${teacherId})`);

    // Check if teacher ID already exists
    const existingTeacher = await Teacher.findOne({ teacherId });
    if (existingTeacher) {
      console.log('❌ Teacher ID already exists!');
      process.exit(1);
    }

    // Get next ID for teacher
    const lastTeacher = await Teacher.findOne().sort({ id: -1 });
    const nextId = lastTeacher ? lastTeacher.id + 1 : 1;

    // Create Teacher document
    const teacher = new Teacher({
      id: nextId,
      name: fullName,
      email: `teacher.${teacherId.toLowerCase()}@shiksha.edu`,
      teacherId: teacherId,
      subjects: subjects,
      assignedClasses: [`Class ${teacherId}`],
      permissions: {
        canUploadMaterials: true,
        canCreateTests: true,
        canManageStudents: true
      }
    });

    await teacher.save();
    console.log('✅ Teacher document created');

    // Create User document
    const hashedPassword = await bcrypt.hash(teacherId, 10);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: `teacher.${teacherId.toLowerCase()}@shiksha.edu`,
      password: hashedPassword,
      role: 'teacher',
      teacherId: teacherId,
      tempPassword: true,
      subject: subjects[0] // Primary subject
    });

    await user.save();
    console.log('✅ User account created');

    console.log('\n🎉 Teacher added successfully!');
    console.log(`Name: ${fullName}`);
    console.log(`Teacher ID: ${teacherId}`);
    console.log(`Login Email: teacher.${teacherId.toLowerCase()}@shiksha.edu`);
    console.log(`Password: ${teacherId} (temporary - same as Teacher ID)`);
    console.log(`Subjects: ${subjects.join(', ')}`);
    console.log('\n🔐 All permissions granted: Upload materials, Create tests, Manage students');

  } catch (error) {
    console.error('❌ Error adding teacher:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

addNewTeacher();