const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  fileUrl: {
    type: String
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  teacherId: {
    type: String
  },
  class: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Material', materialSchema);
