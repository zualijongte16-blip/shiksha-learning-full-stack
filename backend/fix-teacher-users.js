const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
require('dotenv').config({ path: __dirname + '/.env' });

const fixTeacherUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');

    // First, get all teachers and create users for them
    const teachers = await Teacher.find({});
    console.log(`Found ${teachers.length} teachers`);

    for (const teacher of teachers) {
      console.log(`Processing teacher:`, {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        teacherId: teacher.teacherId,
        subjects: teacher.subjects
      });

      // Skip if teacherId is missing
      if (!teacher.teacherId) {
        console.log(`Skipping teacher ${teacher.name} - missing teacherId`);
        continue;
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        role: 'teacher',
        teacherId: teacher.teacherId
      });

      if (!existingUser) {
        console.log(`Creating user for teacher: ${teacher.name} (ID: ${teacher.teacherId})`);

        // Create user entry
        const hashedPassword = await bcrypt.hash(teacher.teacherId, 10);

        const newUser = new User({
          firstName: teacher.name ? teacher.name.split(' ')[0] : 'Teacher',
          lastName: teacher.name ? teacher.name.split(' ').slice(1).join(' ') : teacher.teacherId,
          email: teacher.email || `${teacher.teacherId}@shiksha.edu`,
          password: hashedPassword,
          role: 'teacher',
          teacherId: teacher.teacherId,
          tempPassword: true
        });

        await newUser.save();
        console.log(`Created user for teacher ${teacher.teacherId}`);
      } else {
        console.log(`User already exists for teacher ${teacher.teacherId}`);
      }
    }

    // Now manually add the missing teachers mentioned by user: 2001, 2002
    const teacherConfigs = {
      '2001': {
        name: 'Evelyn',
        subjects: ['Mathematics', 'Physics', 'Computer'],
        assignedClasses: ['class 8',]
      },
      '2002': {
        name: 'Teacher 2002',
        subjects: ['Science', 'Chemistry', 'Biology'],
        assignedClasses: ['Grade 10B', 'Grade 11B', 'Grade 12B']
      },
      '2003': {
        name: 'Teacher 2003',
        subjects: ['English', 'History', 'Geography'],
        assignedClasses: ['Grade 9A', 'Grade 10A', 'Grade 11A']
      },
      '2004': {
        name: 'Teacher 2004',
        subjects: ['Computer Science', 'Mathematics', 'Physics'],
        assignedClasses: ['Grade 11A', 'Grade 12A', 'Grade 12B']
      }
    };

    const missingTeacherIds = Object.keys(teacherConfigs);

    for (const teacherId of missingTeacherIds) {
      // Check if teacher exists in Teacher collection
      let teacher = await Teacher.findOne({ teacherId });

      if (!teacher) {
        // Create teacher entry with specific subjects
        const config = teacherConfigs[teacherId];
        console.log(`Creating teacher entry for ID: ${teacherId} with subjects: ${config.subjects.join(', ')}`);

        teacher = new Teacher({
          id: parseInt(teacherId),
          name: config.name,
          email: `teacher.${teacherId}@shiksha.edu`,
          teacherId: teacherId,
          subjects: config.subjects,
          assignedClasses: config.assignedClasses,
          permissions: {
            canUploadMaterials: true,
            canCreateTests: true,
            canManageStudents: true
          }
        });
        await teacher.save();
      }

      // Check if user exists
      const existingUser = await User.findOne({
        role: 'teacher',
        teacherId: teacherId
      });

      if (!existingUser) {
        console.log(`Creating user for teacher ID: ${teacherId}`);

        const hashedPassword = await bcrypt.hash(teacherId, 10);

        const newUser = new User({
          firstName: 'Teacher',
          lastName: teacherId,
          email: `teacher.${teacherId}@shiksha.edu`,
          password: hashedPassword,
          role: 'teacher',
          teacherId: teacherId,
          tempPassword: true
        });

        await newUser.save();
        console.log(`Created user for teacher ${teacherId}`);
      } else {
        console.log(`User already exists for teacher ${teacherId}`);
      }
    }

    console.log('Fix completed');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

fixTeacherUsers();