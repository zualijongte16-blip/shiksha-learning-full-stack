const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String },
  class: { type: String },
  address: { type: String },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
