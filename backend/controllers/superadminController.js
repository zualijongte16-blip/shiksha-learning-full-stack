const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Material = require('../models/Material');

// Get superadmin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalRevenue = await User.aggregate([{ $group: { _id: null, total: { $sum: '$registrationFee' } } }]).then(result => result[0]?.total || 0);
    const activeCourses = await Course.countDocuments({ progress: { $gt: 0 } });
    const pendingPayments = await User.countDocuments({ registrationFee: { $gt: 0 } });
    const totalSignups = await User.countDocuments({ role: 'student' });
    const activeStudents = await Student.countDocuments();
    const totalAdmins = await User.countDocuments({ role: { $in: ['admin', 'superadmin'] } });

    const stats = {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalRevenue,
      activeCourses,
      pendingPayments,
      totalSignups,
      activeStudents,
      totalAdmins
    };
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students with full management capabilities
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create student with full permissions
exports.createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password, class: classField, course, address, phone, registrationFee } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      class: classField,
      address,
      phone,
      registrationFee,
      role: 'student'
    });
    await newUser.save();

    // Create student
    const newStudent = new Student({
      name: `${firstName} ${lastName}`,
      email,
      course,
      class: classField,
      address,
      phone
    });
    await newStudent.save();

    res.status(201).json({ message: 'Student created successfully', student: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all teachers with full management capabilities
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create teacher with full permissions
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, teacherId, subjects } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ $or: [{ email }, { teacherId }] });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    // Create teacher
    const newTeacher = new Teacher({
      name,
      email,
      teacherId,
      subjects
    });
    await newTeacher.save();

    // Create user entry for login
    const newUser = new User({
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' ') || '',
      email,
      password: await bcrypt.hash(teacherId, 10), // Initial password is teacherId
      role: 'teacher',
      teacherId,
      tempPassword: true // Flag for initial password
    });
    await newUser.save();

    res.status(201).json({ message: 'Teacher created successfully', teacher: newTeacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student with full permissions
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const student = await Student.findByIdAndUpdate(id, updatedData, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete student with full permissions
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Also delete associated user if needed
    await User.findOneAndDelete({ email: student.email });

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update teacher with full permissions
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const teacher = await Teacher.findByIdAndUpdate(id, updatedData, { new: true });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({ message: 'Teacher updated successfully', teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete teacher with full permissions
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Delete associated user
    await User.findOneAndDelete({ teacherId: teacher.teacherId });

    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all courses with full management
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

// Create course with full permissions
exports.createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update course with full permissions
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const course = await Course.findByIdAndUpdate(id, updatedData, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete course with full permissions
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users for management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user permissions (superadmin only)
exports.updateUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const user = await User.findByIdAndUpdate(id, { permissions }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User permissions updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create admin user (superadmin only)
exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user with default permissions
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin',
      permissions: {
        canCreateStudent: false,
        canEditStudent: false,
        canDeleteStudent: false,
        canCreateTeacher: false,
        canEditTeacher: false,
        canDeleteTeacher: false,
        canCreateCourse: false,
        canEditCourse: false,
        canDeleteCourse: false,
        canViewReports: true,
        canManagePermissions: false,
        canViewProgress: true
      }
    });
    await newUser.save();

    res.status(201).json({ message: 'Admin created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().populate('courseId');
    res.status(200).json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payments
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

// Get comprehensive reports
exports.getReports = async (req, res) => {
  try {
    const courses = await Course.find();
    const teachers = await Teacher.find();
    const students = await Student.find();
    const revenue = await User.aggregate([{ $group: { _id: null, total: { $sum: '$registrationFee' } } }]).then(result => result[0]?.total || 0);

    const studentProgress = courses.map(course => ({
      courseName: course.name,
      enrolled: course.enrolledStudents ? course.enrolledStudents.length : 0,
      progress: course.progress
    }));

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
      revenue,
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalCourses: courses.length
    };
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Deactivate user (superadmin only)
exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deactivated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Activate user (superadmin only)
exports.activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User activated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};