require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

const checkStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas\n');

    const students = await Student.find({});
    console.log('Total students in database:', students.length);
    console.log('\nAll students:');

    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name}`);
      console.log(`   ID: ${student.id}`);
      console.log(`   Email: ${student.email}`);
      console.log(`   Phone: ${student.phone}`);
      console.log(`   Class: ${student.class}`);
      console.log(`   Course: ${student.course}`);
      console.log('---');
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkStudents();
