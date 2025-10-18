const express = require('express');
const {
  getTestsByTeacher,
  getTestsByCourse,
  createTest,
  updateTest,
  deleteTest,
  getTest,
  getTestsForStudent,
  submitQuiz,
  getStudentQuizResults
} = require('../controllers/testController');

const router = express.Router();

// Get all tests for a teacher
router.get('/teacher/:teacherId', getTestsByTeacher);

// Get all tests for a course
router.get('/course/:courseId', getTestsByCourse);

// Get available tests for a student
router.get('/student/:studentId', getTestsForStudent);

// Submit quiz answers
router.post('/submit', submitQuiz);

// Get student's quiz results
router.get('/results/:studentId', getStudentQuizResults);

// Get a single test
router.get('/:id', getTest);

// Create a new test
router.post('/', createTest);

// Update a test
router.put('/:id', updateTest);

// Delete a test
router.delete('/:id', deleteTest);

module.exports = router;
