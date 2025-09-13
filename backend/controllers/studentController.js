const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

// Helper function to read the database file
const readDb = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Get all students
exports.getStudents = (req, res) => {
  const db = readDb();
  res.json(db.students || []);
};

// Get student by id
exports.getStudentById = (req, res) => {
  const db = readDb();
  const student = (db.students || []).find(s => s.id == req.params.id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
};
