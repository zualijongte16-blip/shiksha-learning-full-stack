const Test = require('../models/Test');
const Course = require('../models/Course');

// Get all tests for a specific teacher
exports.getTestsByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const tests = await Test.find({ teacherId }).populate('courseId');
    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tests for a specific course
exports.getTestsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const tests = await Test.find({ courseId }).populate('courseId');
    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new test
exports.createTest = async (req, res) => {
  try {
    const { title, description, courseId, teacherId, questions, duration, scheduledDate, deadline } = req.body;

    // Calculate total points
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const newTest = new Test({
      title,
      description,
      courseId,
      teacherId,
      questions,
      duration,
      totalPoints,
      scheduledDate,
      deadline
    });

    await newTest.save();
    res.status(201).json({ message: 'Test created successfully', test: newTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a test
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.questions) {
      updates.totalPoints = updates.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    }

    const test = await Test.findByIdAndUpdate(id, updates, { new: true });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ message: 'Test updated successfully', test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a test
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByIdAndDelete(id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single test
exports.getTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id).populate('courseId');

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};