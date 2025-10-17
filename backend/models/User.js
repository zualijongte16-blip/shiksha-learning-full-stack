const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin', 'superadmin'], default: 'student' },
  teacherId: { type: String },
  tempPassword: { type: Boolean, default: false },
  registrationFee: { type: Number, default: 0 },
  class: { type: String },
  course: { type: String },
  address: { type: String },
  phone: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  passwordResetAttempts: { type: Number, default: 0 },
  permissions: {
    canCreateStudent: { type: Boolean, default: false },
    canEditStudent: { type: Boolean, default: false },
    canDeleteStudent: { type: Boolean, default: false },
    canCreateTeacher: { type: Boolean, default: false },
    canEditTeacher: { type: Boolean, default: false },
    canDeleteTeacher: { type: Boolean, default: false },
    canCreateCourse: { type: Boolean, default: false },
    canEditCourse: { type: Boolean, default: false },
    canDeleteCourse: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManagePermissions: { type: Boolean, default: false },
    canViewProgress: { type: Boolean, default: true }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Pre-save middleware to normalize email to lowercase
userSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
