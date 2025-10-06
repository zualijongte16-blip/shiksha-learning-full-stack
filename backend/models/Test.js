const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index of correct option
  points: { type: Number, default: 1 }
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: String, required: true },
  questions: [questionSchema],
  duration: { type: Number }, // Duration in minutes
  totalPoints: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  scheduledDate: { type: Date },
  deadline: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);