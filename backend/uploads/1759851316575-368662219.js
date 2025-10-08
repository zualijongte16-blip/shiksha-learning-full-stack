require('dotenv').config();
const mongoose = require('mongoose');
const Teacher = require('./models/Teacher');
const User = require('./models/User');

async function testTeacherCreation() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Test data
    const testData = {
      name: 'Test Teacher',
      email: 'test.teacher@shiksha.edu',
      teacherId: 'T004',
      subjects: ['Math', 'Science']
    };

    console.log('Testing teacher creation with data:', testData);

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({
      $or: [{ email: testData.email }, { teacherId: testData.teacherId }]
    });

    if (existingTeacher) {
      console.log('Teacher already exists:', existingTeacher);
      return;
    }

    // Create teacher
    const newTeacher = new Teacher(testData);
    const savedTeacher = await newTeacher.save();
    console.log('Teacher created successfully:', savedTeacher);

    // Create user
    const newUser = new User({
      firstName: testData.name.split(' ')[0],
      lastName: testData.name.split(' ').slice(1).join(' ') || '',
      email: testData.email,
      password: await require('bcryptjs').hash(testData.teacherId, 10),
      role: 'teacher',
      teacherId: testData.teacherId,
      tempPassword: true
    });

    const savedUser = await newUser.save();
    console.log('User created successfully:', savedUser);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testTeacherCreation();