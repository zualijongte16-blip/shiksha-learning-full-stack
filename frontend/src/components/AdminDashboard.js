import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

import PasswordChangeForm from './PasswordChangeForm';

import './AdminDashboard.css';

const EditModal = ({ isOpen, onClose, item, type, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit {type}</h3>
        <form onSubmit={handleSubmit}>
          {type === 'Student' && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Class (8-12)</label>
                <input type="text" name="class" value={formData.class || ''} onChange={handleChange} required placeholder="e.g., Class 10" />
              </div>
            </>
          )}
          {type === 'Teacher' && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" name="subject" value={formData.subject || ''} onChange={handleChange} required />
              </div>
            </>
          )}
          {type === 'Course' && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Progress (%)</label>
                <input type="number" name="progress" value={formData.progress || 0} onChange={handleChange} min="0" max="100" required />
              </div>
            </>
          )}
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddModal = ({ isOpen, onClose, type, onSave }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add {type}</h3>
        <form onSubmit={handleSubmit}>
          {type === 'Student' && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Class (8-12)</label>
                <input type="text" name="class" value={formData.class || ''} onChange={handleChange} required placeholder="e.g., Class 10" />
              </div>
            </>
          )}
          {type === 'Teacher' && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" name="subject" value={formData.subject || ''} onChange={handleChange} required />
              </div>
            </>
          )}
          {type === 'Course' && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Progress (%)</label>
                <input type="number" name="progress" value={formData.progress || 0} onChange={handleChange} min="0" max="100" required />
              </div>
            </>
          )}
          <div className="modal-actions">
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = ({ username, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState({});
  const [editModal, setEditModal] = useState({ isOpen: false, item: null, type: '' });
  const [addModal, setAddModal] = useState({ isOpen: false, type: '' });
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDashboardDarkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  // Apply dark mode class when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Dark mode toggle function
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Save preference to localStorage
    localStorage.setItem('adminDashboardDarkMode', newDarkMode.toString());

    // Apply dark mode class to body and html elements
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  };

  const fetchDashboardData = async () => {
    console.log('fetchDashboardData called');
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats
      const statsRes = await fetch('http://localhost:5001/api/admin/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else if (statsRes.status === 403) {
        // Password change required
        const errorData = await statsRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        }
      } else {
        console.error('Failed to fetch stats:', statsRes.status);
      }

      // Fetch students
      const studentsRes = await fetch('http://localhost:5001/api/admin/students', { headers });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      } else if (studentsRes.status === 403) {
        const errorData = await studentsRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        } else {
          setStudents([]);
        }
      } else {
        console.error('Failed to fetch students:', studentsRes.status);
        setStudents([]);
      }

      // Fetch teachers
      const teachersRes = await fetch('http://localhost:5001/api/admin/teachers', { headers });
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setTeachers(Array.isArray(teachersData) ? teachersData : []);
        console.log('Teachers data received:', teachersData);
      } else if (teachersRes.status === 403) {
        const errorData = await teachersRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        } else {
          setTeachers([]);
        }
      } else {
        console.error('Failed to fetch teachers:', teachersRes.status, teachersRes.statusText);
        setTeachers([]);
      }

      // Fetch courses
      const coursesRes = await fetch('http://localhost:5001/api/admin/courses', { headers });
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } else if (coursesRes.status === 403) {
        const errorData = await coursesRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        } else {
          setCourses([]);
        }
      } else {
        console.error('Failed to fetch courses:', coursesRes.status);
        setCourses([]);
      }

      // Fetch reports
      const reportsRes = await fetch('http://localhost:5001/api/admin/reports', { headers });
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData || {});
      } else if (reportsRes.status === 403) {
        const errorData = await reportsRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        } else {
          setReports({});
        }
      } else {
        console.error('Failed to fetch reports:', reportsRes.status);
        setReports({});
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty arrays/objects as fallbacks
      setStudents([]);
      setTeachers([]);
      setCourses([]);
      setReports({});
      setStats({});
    }
  };

  const handlePasswordChanged = () => {
    setRequirePasswordChange(false);
    setUserInfo(null);
    // Refresh dashboard data after password change
    fetchDashboardData();
  };

  // Admin cannot edit or delete - only view progress
  const handleEdit = (item, type) => {
    alert('Admin can only view progress. Contact SuperAdmin for modifications.');
  };

  const handleDelete = async (id, type) => {
    alert('Admin can only view progress. Contact SuperAdmin for deletions.');
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const { id } = updatedData;
      let payload = { ...updatedData };
      if (editModal.type === 'Student') {
        // For students, ensure only class is used, remove course if present
        delete payload.course;
      }
      const endpoint = editModal.type === 'Student' ? 'students' : editModal.type === 'Teacher' ? 'teachers' : 'courses';
      const response = await fetch(`http://localhost:5001/api/admin/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(`${editModal.type} updated successfully`);
        fetchDashboardData(); // Refresh data
      } else {
        alert(`Failed to update ${editModal.type.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error updating ${editModal.type}:`, error);
      alert(`Error updating ${editModal.type.toLowerCase()}`);
    }
  };

  // Admin cannot add - only view progress
  const handleAdd = (type) => {
    alert('Admin can only view progress. Contact SuperAdmin to add new items.');
  };

  const handleSaveAdd = async (newData) => {
    alert('Admin can only view progress. Contact SuperAdmin to add new items.');
  };

  const renderOverview = () => (
    <div className="overview-section">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{stats.totalStudents || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Teachers</h3>
          <p className="stat-number">{stats.totalTeachers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p className="stat-number">{stats.totalCourses || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">Rs{stats.totalRevenue || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Signups</h3>
          <p className="stat-number">{stats.totalSignups || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Students</h3>
          <p className="stat-number">{stats.activeStudents || 0}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Student Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.studentProgress || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="courseName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="enrolled" fill="#8884d8" />
              <Bar dataKey="progress" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[{ name: 'This Month', revenue: stats.totalRevenue || 0 }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Course Enrollment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reports.courseEnrollment || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label
              >
                {reports.courseEnrollment?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Progress Overview</h3>
        <div className="action-buttons">
          <button onClick={() => setActiveSection('students')}>View Student Progress</button>
          <button onClick={() => setActiveSection('teachers')}>View Teacher Status</button>
          <button onClick={() => setActiveSection('courses')}>View Course Progress</button>
          <button onClick={() => setActiveSection('reports')}>View Progress Reports</button>
        </div>
        <div className="admin-info">
          <p><strong>Role:</strong> {stats.role}</p>
          <p><strong>Permissions:</strong> {stats.canViewProgress ? 'Can view progress' : 'Limited access'}</p>
          <p className="access-note">Contact SuperAdmin for any modifications or additions</p>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="students-section">
      <h2>Student Progress View</h2>
      <p className="section-description">View student progress and information (Read-only access)</p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>

            {Array.isArray(students) && students.length > 0 ? (
              students.map(student => (
                <tr key={student._id}>
                  <td>{student._id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.class}</td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No students found or data is loading...
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTeachers = () => (
    <div className="teachers-section">
      <h2>Teacher Progress View</h2>
      <p className="section-description">View teacher information and progress (Read-only access)</p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Teacher ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(teachers) && teachers.length > 0 ? (
              teachers.map(teacher => (
                <tr key={teacher._id}>
                  <td>{teacher._id}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.teacherId}</td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No teachers found or data is loading...
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="courses-section">
      <h2>Course Progress View</h2>
      <p className="section-description">View course progress and information (Read-only access)</p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Teacher</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map(course => (
                <tr key={course._id}>
                  <td>{course._id}</td>
                  <td>{course.name}</td>
                  <td>{course.description}</td>
                  <td>{course.teacherId}</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progress || 0}%` }}>
                        {course.progress || 0}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${course.progress > 50 ? 'active' : 'inactive'}`}>
                      {course.progress > 50 ? 'In Progress' : 'Not Started'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No courses found or data is loading...
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="reports-section">
      <h2>Reports & Analytics</h2>
      <div className="reports-grid">
        <div className="report-card">
          <h3>Student Progress Report</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reports.studentProgress || []}>
              <XAxis dataKey="courseName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="report-card">
          <h3>Teacher Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reports.teacherPerformance || []}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'students':
        return renderStudents();
      case 'teachers':
        return renderTeachers();
      case 'courses':
        return renderCourses();
      case 'reports':
        return renderReports();
      default:
        return renderOverview();
    }
  };

  // Show password change form if required
  if (requirePasswordChange && userInfo) {
    return (
      <PasswordChangeForm
        user={userInfo}
        onPasswordChanged={handlePasswordChanged}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <p>Welcome, {username}</p>
        </div>
        <nav className="admin-nav">
          <ul>
            <li className={activeSection === 'overview' ? 'active' : ''} onClick={() => setActiveSection('overview')}>
              Dashboard Overview
            </li>
            <li className={activeSection === 'students' ? 'active' : ''} onClick={() => setActiveSection('students')}>
              Student Management
            </li>
            <li className={activeSection === 'teachers' ? 'active' : ''} onClick={() => setActiveSection('teachers')}>
              Teacher Management
            </li>
            <li className={activeSection === 'courses' ? 'active' : ''} onClick={() => setActiveSection('courses')}>
              Course Management
            </li>
            <li className={activeSection === 'reports' ? 'active' : ''} onClick={() => setActiveSection('reports')}>
              Reports & Analytics
            </li>
          </ul>
        </nav>
        <div className="admin-footer">
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="admin-main">
        <div className="admin-header-controls">
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Night Mode">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            🚪 Logout
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
