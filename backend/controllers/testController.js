const Test = require('../models/Test');
const Course = require('../models/Course');
const QuizSubmission = require('../models/QuizSubmission');

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

// Get available tests for a student (assigned by their teachers)
exports.getTestsForStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find all tests and filter by active status and deadline
    const tests = await Test.find({
      isActive: true,
      $or: [
        { deadline: { $exists: false } },
        { deadline: { $gte: new Date() } }
      ]
    }).populate('courseId');

    // Get student's previous submissions to filter out completed tests
    const submissions = await QuizSubmission.find({ studentId }).select('testId');
    const submittedTestIds = submissions.map(sub => sub.testId.toString());

    // Filter out tests already submitted by the student
    const availableTests = tests.filter(test => !submittedTestIds.includes(test._id.toString()));

    res.status(200).json(availableTests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    const { studentId, testId, answers, timeTaken, isAutoSubmitted } = req.body;

    // Get the test to calculate score
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / test.questions.length) * 100);

    // Create submission record
    const submission = new QuizSubmission({
      studentId,
      testId,
      answers,
      score,
      totalQuestions: test.questions.length,
      correctAnswers,
      timeTaken,
      isAutoSubmitted: isAutoSubmitted || false
    });

    await submission.save();

    res.status(201).json({
      message: 'Quiz submitted successfully',
      submission: {
        score,
        correctAnswers,
        totalQuestions: test.questions.length,
        timeTaken
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's quiz results
exports.getStudentQuizResults = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const submissions = await QuizSubmission.find({ studentId })
      .populate('testId')
      .sort({ submittedAt: -1 });

    res.status(200).json(submissions);
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
