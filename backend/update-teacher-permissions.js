const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
require('dotenv').config({ path: __dirname + '/.env' });

const updateTeacherPermissions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');

    // Update teacher permissions
    const teacherIds = ['2001', '2002'];

    for (const teacherId of teacherIds) {
      // Update Teacher collection
      const teacherUpdate = await Teacher.findOneAndUpdate(
        { teacherId },
        {
          name: teacherId === '2001' ? 'Evelyn ' : `Teacher ${teacherId}`,
          subjects: ['Mathematics', 'Science', 'English', 'Physics'],
          assignedClasses: [`Class ${teacherId}`, '8', '9'],
          permissions: {
            canUploadMaterials: true,
            canCreateTests: true,
            canManageStudents: true
          }
        },
        { new: true }
      );

      if (teacherUpdate) {
        console.log(`Updated Teacher ${teacherId}:`, teacherUpdate.name);
      }

      // Update User collection
      const userUpdate = await User.findOneAndUpdate(
        { teacherId, role: 'teacher' },
        {
          firstName: teacherId === '2001' ? 'Evelyn' : 'Teacher',
          lastName: teacherId === '2001' ? '' : teacherId,
          subject: 'Mathematics' // Add subject field
        },
        { new: true }
      );

      if (userUpdate) {
        console.log(`Updated User ${teacherId}:`, userUpdate.firstName, userUpdate.lastName);
      }
    }

    console.log('Teacher permissions update completed');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

updateTeacherPermissions();