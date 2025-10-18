const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [{ type: Number }], // Array of selected option indices
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
  timeTaken: { type: Number }, // Time taken in minutes
  isAutoSubmitted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
