const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Get all courses
exports.getCourses = (req, res) => {
  const db = readDb();
  res.json(db.courses || []);
};

// Get course by id
exports.getCourseById = (req, res) => {
  const db = readDb();
  const course = (db.courses || []).find(c => c.id == req.params.id);
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
};
