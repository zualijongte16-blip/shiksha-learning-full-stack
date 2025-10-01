const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  teacherId: { type: String },
  tempPassword: { type: Boolean, default: false },
  registrationFee: { type: Number, default: 0 },
  class: { type: String },
  course: { type: String },
  address: { type: String },
  phone: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true });

// Pre-save middleware to normalize email to lowercase
userSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
