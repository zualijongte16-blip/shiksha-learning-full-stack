const mongoose = require('mongoose');
const Teacher = require('./models/Teacher');
require('dotenv').config({ path: __dirname + '/.env' });

const assignTeacherSubjects = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');

    // Define subject assignments for each teacher ID
    const teacherSubjectAssignments = {
      '2001': {
        name: 'Evelyn ',
        subjects: ['Mathematics', 'Physics'],
        assignedClasses: ['8', '9',]
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
      },
      'T001': {
        name: 'Teacher T001',
        subjects: ['Mathematics', 'Statistics'],
        assignedClasses: ['Grade 10A', 'Grade 11B']
      }
    };

    // Update each teacher with their specific subjects
    for (const [teacherId, config] of Object.entries(teacherSubjectAssignments)) {
      console.log(`\n🔄 Updating teacher ${teacherId} (${config.name})`);

      const result = await Teacher.findOneAndUpdate(
        { teacherId: teacherId },
        {
          name: config.name,
          subjects: config.subjects,
          assignedClasses: config.assignedClasses,
          permissions: {
            canUploadMaterials: true,
            canCreateTests: true,
            canManageStudents: true
          }
        },
        { new: true, upsert: true }
      );

      if (result) {
        console.log(`✅ Updated teacher ${teacherId}:`);
        console.log(`   📚 Subjects: ${result.subjects.join(', ')}`);
        console.log(`   🏫 Classes: ${result.assignedClasses.join(', ')}`);
      } else {
        console.log(`❌ Failed to update teacher ${teacherId}`);
      }
    }

    // Display all teachers and their subjects
    console.log('\n📋 FINAL TEACHER SUBJECT ASSIGNMENTS:');
    console.log('=' .repeat(50));

    const allTeachers = await Teacher.find({});
    for (const teacher of allTeachers) {
      console.log(`\n👨‍🏫 Teacher ID: ${teacher.teacherId}`);
      console.log(`   Name: ${teacher.name}`);
      console.log(`   📚 Subjects: ${teacher.subjects.join(', ')}`);
      console.log(`   🏫 Classes: ${teacher.assignedClasses.join(', ')}`);
    }

    console.log('\n🎉 Subject assignment completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

assignTeacherSubjects();