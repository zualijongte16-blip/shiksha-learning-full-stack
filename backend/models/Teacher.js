const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  teacherId: { type: String, required: true, unique: true },
  subjects: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
