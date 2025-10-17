const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Material = require('../models/Material');

// Get dashboard statistics (read-only for admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ progress: { $gt: 0 } });
    const totalSignups = await User.countDocuments({ role: 'student' });
    const activeStudents = await Student.countDocuments();

    // Admin can only see progress-related stats, not revenue or payments
    const stats = {
      totalStudents,
      totalTeachers,
      totalCourses,
      activeCourses,
      totalSignups,
      activeStudents,
      // Remove revenue and payment info for admin users
      role: req.user.role,
      permissions: req.user.permissions
    };
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin cannot create students - only view progress
exports.createStudent = async (req, res) => {
  return res.status(403).json({ message: 'Access denied. Admin cannot create students.' });
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findOne({ teacherId: id });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin cannot create teachers - only view progress
exports.createTeacher = async (req, res) => {
  return res.status(403).json({ message: 'Access denied. Admin cannot create teachers.' });
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { teacherId } = req.query;
    let query = {};

    if (teacherId) {
      query.teacherId = teacherId;
    }

    const courses = await Course.find(query).populate('enrolledStudents materials');
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin cannot create courses - only view progress
exports.createCourse = async (req, res) => {
  return res.status(403).json({ message: 'Access denied. Admin cannot create courses.' });
};

// Get all users (for management)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().populate('courseId');
    res.status(200).json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Placeholder for payments - since no payments table, return user fees
exports.getPayments = async (req, res) => {
  try {
    const users = await User.find().select('firstName lastName email registrationFee');
    const payments = users.map(user => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      amount: user.registrationFee || 0,
      status: 'paid'
    }));
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Placeholder for reports
exports.getReports = async (req, res) => {
  try {
    const courses = await Course.find();
    const teachers = await Teacher.find();
    const revenue = await User.aggregate([{ $group: { _id: null, total: { $sum: '$registrationFee' } } }]).then(result => result[0]?.total || 0);

    const studentProgress = courses.map(course => ({
      courseName: course.name,
      enrolled: course.enrolledStudents ? course.enrolledStudents.length : 0,
      progress: course.progress
    }));

    // For teacherPerformance, assuming no students/courses fields in Teacher; use counts or expand model if needed
    const teacherPerformance = teachers.map(teacher => ({
      name: teacher.name,
      students: 0, // Placeholder; aggregate if needed
      courses: 0 // Placeholder; aggregate if needed
    }));

    const courseEnrollment = courses.map(course => ({
      name: course.name,
      value: course.enrolledStudents ? course.enrolledStudents.length : 0
    }));

    const reports = {
      studentProgress,
      teacherPerformance,
      courseEnrollment,
      revenue
    };
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin cannot update students - only view progress
exports.updateStudent = async (req, res) => {
  return res.status(403).json({ message: 'Access denied. Admin cannot update students.' });
};

// Admin cannot delete students - only view progress
exports.deleteStudent = async (req, res) => {
  return res.status(403).json({ message: 'Access denied. Admin cannot delete students.' });
};

// Admin cannot update teachers - only view progress
exports.updateTeacher = async (req, res) => {
  return res.status(403).json({ message: 'Access denied. Admin cannot update teachers.' });
};

// Admin cannot delete teachers - only view progress
exports.deleteTeacher = async (req, res) => {
  return res.status(403).json({ message: 'Access denied. Admin cannot delete teachers.' });
};

// Admin cannot update courses - only view progress
exports.updateCourse = async (req, res) => {
  return res.status(403).json({ message: 'Access denied. Admin cannot update courses.' });
};

// Admin cannot delete courses - only view progress
exports.deleteCourse = async (req, res) => {
  return res.status(403).json({ message: 'Access denied. Admin cannot delete courses.' });
};
