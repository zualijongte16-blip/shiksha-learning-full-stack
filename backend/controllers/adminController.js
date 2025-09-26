const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

// Helper function to read the database file
const readDb = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Helper function to write to the database file
const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Get dashboard statistics
exports.getDashboardStats = (req, res) => {
  const db = readDb();
  const stats = {
    totalStudents: db.students.length,
    totalTeachers: db.teachers.length,
    totalCourses: db.courses.length,
    totalRevenue: db.users.reduce((sum, user) => sum + (user.registrationFee || 0), 0),
    activeCourses: db.courses.filter(course => course.progress > 0).length,
    pendingPayments: db.users.filter(user => user.registrationFee && user.registrationFee > 0).length, // Simplified
    totalSignups: db.users.filter(user => user.role === 'student').length,
    activeStudents: db.students.length // Students enrolled/using the platform
  };
  res.status(200).json(stats);
};

// Get all students
exports.getAllStudents = (req, res) => {
  const db = readDb();
  res.status(200).json(db.students);
};

// Create student
exports.createStudent = (req, res) => {
  const newStudent = req.body;
  const db = readDb();

  // Generate new ID
  const newId = db.students.length > 0 ? Math.max(...db.students.map(s => s.id)) + 1 : 1;
  newStudent.id = newId;

  db.students.push(newStudent);
  writeDb(db);
  res.status(201).json({ message: 'Student created successfully', student: newStudent });
};

// Get all teachers
exports.getAllTeachers = (req, res) => {
  const db = readDb();
  res.status(200).json(db.teachers);
};

// Create teacher
exports.createTeacher = (req, res) => {
  const newTeacher = req.body;
  const db = readDb();

  // Generate new ID
  const newId = db.teachers.length > 0 ? Math.max(...db.teachers.map(t => t.id)) + 1 : 1;
  newTeacher.id = newId;

  db.teachers.push(newTeacher);
  writeDb(db);
  res.status(201).json({ message: 'Teacher created successfully', teacher: newTeacher });
};

// Get all courses
exports.getAllCourses = (req, res) => {
  const db = readDb();
  res.status(200).json(db.courses);
};

// Create course
exports.createCourse = (req, res) => {
  const newCourse = req.body;
  const db = readDb();

  // Generate new ID
  const newId = db.courses.length > 0 ? Math.max(...db.courses.map(c => c.id)) + 1 : 1;
  newCourse.id = newId;

  db.courses.push(newCourse);
  writeDb(db);
  res.status(201).json({ message: 'Course created successfully', course: newCourse });
};

// Get all users (for management)
exports.getAllUsers = (req, res) => {
  const db = readDb();
  res.status(200).json(db.users);
};

// Get materials
exports.getAllMaterials = (req, res) => {
  const db = readDb();
  res.status(200).json(db.materials);
};

// Placeholder for payments - since no payments table, return user fees
exports.getPayments = (req, res) => {
  const db = readDb();
  const payments = db.users.map(user => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    amount: user.registrationFee || 0,
    status: 'paid'
  }));
  res.status(200).json(payments);
};

// Placeholder for reports
exports.getReports = (req, res) => {
  const db = readDb();
  const reports = {
    studentProgress: db.courses.map(course => ({
      courseName: course.name,
      enrolled: course.enrolledStudents ? course.enrolledStudents.length : 0,
      progress: course.progress
    })),
    teacherPerformance: db.teachers.map(teacher => ({
      name: teacher.name,
      students: teacher.students ? teacher.students.length : 0,
      courses: teacher.courses ? teacher.courses.length : 0
    })),
    courseEnrollment: db.courses.map(course => ({
      name: course.name,
      value: course.enrolledStudents ? course.enrolledStudents.length : 0
    })),
    revenue: db.users.reduce((sum, user) => sum + (user.registrationFee || 0), 0)
  };
  res.status(200).json(reports);
};

// Update student
exports.updateStudent = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const db = readDb();

  const studentIndex = db.students.findIndex(s => s.id === parseInt(id));
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  db.students[studentIndex] = { ...db.students[studentIndex], ...updatedData };
  writeDb(db);
  res.status(200).json({ message: 'Student updated successfully', student: db.students[studentIndex] });
};

// Delete student
exports.deleteStudent = (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const studentIndex = db.students.findIndex(s => s.id === parseInt(id));
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  db.students.splice(studentIndex, 1);
  writeDb(db);
  res.status(200).json({ message: 'Student deleted successfully' });
};

// Update teacher
exports.updateTeacher = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const db = readDb();

  const teacherIndex = db.teachers.findIndex(t => t.id === parseInt(id));
  if (teacherIndex === -1) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  db.teachers[teacherIndex] = { ...db.teachers[teacherIndex], ...updatedData };
  writeDb(db);
  res.status(200).json({ message: 'Teacher updated successfully', teacher: db.teachers[teacherIndex] });
};

// Delete teacher
exports.deleteTeacher = (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const teacherIndex = db.teachers.findIndex(t => t.id === parseInt(id));
  if (teacherIndex === -1) {
    return res.status(404).json({ message: 'Teacher not found' });
  }

  db.teachers.splice(teacherIndex, 1);
  writeDb(db);
  res.status(200).json({ message: 'Teacher deleted successfully' });
};

// Update course
exports.updateCourse = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const db = readDb();

  const courseIndex = db.courses.findIndex(c => c.id === parseInt(id));
  if (courseIndex === -1) {
    return res.status(404).json({ message: 'Course not found' });
  }

  db.courses[courseIndex] = { ...db.courses[courseIndex], ...updatedData };
  writeDb(db);
  res.status(200).json({ message: 'Course updated successfully', course: db.courses[courseIndex] });
};

// Delete course
exports.deleteCourse = (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const courseIndex = db.courses.findIndex(c => c.id === parseInt(id));
  if (courseIndex === -1) {
    return res.status(404).json({ message: 'Course not found' });
  }

  db.courses.splice(courseIndex, 1);
  writeDb(db);
  res.status(200).json({ message: 'Course deleted successfully' });
};
