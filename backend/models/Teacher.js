const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  teacherId: { type: String, required: true, unique: true },
  subjects: [{ type: String }],
  assignedClasses: [{ type: String }], // Classes this teacher can teach
  permissions: {
    canUploadMaterials: { type: Boolean, default: true },
    canCreateTests: { type: Boolean, default: true },
    canManageStudents: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
