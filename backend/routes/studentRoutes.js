const express = require('express');
const { getStudents, getStudentById } = require('../controllers/studentController');

const router = express.Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);

module.exports = router;
