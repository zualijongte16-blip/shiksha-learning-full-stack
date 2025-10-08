import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import PasswordChangeForm from './PasswordChangeForm';
import './AdminDashboard.css';

const PermissionModal = ({ isOpen, onClose, user, onSave }) => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (user && user.permissions) {
      setPermissions({ ...user.permissions });
    }
  }, [user]);

  const handlePermissionChange = (permission) => {
    setPermissions({ ...permissions, [permission]: !permissions[permission] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, permissions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Manage Permissions - {user?.name}</h3>
        <form onSubmit={handleSubmit}>
          <div className="permissions-grid">
            <label>
              <input
                type="checkbox"
                checked={permissions.canCreateStudent || false}
                onChange={() => handlePermissionChange('canCreateStudent')}
              />
              Create Students
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canEditStudent || false}
                onChange={() => handlePermissionChange('canEditStudent')}
              />
              Edit Students
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canDeleteStudent || false}
                onChange={() => handlePermissionChange('canDeleteStudent')}
              />
              Delete Students
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canCreateTeacher || false}
                onChange={() => handlePermissionChange('canCreateTeacher')}
              />
              Create Teachers
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canEditTeacher || false}
                onChange={() => handlePermissionChange('canEditTeacher')}
              />
              Edit Teachers
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canDeleteTeacher || false}
                onChange={() => handlePermissionChange('canDeleteTeacher')}
              />
              Delete Teachers
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canCreateCourse || false}
                onChange={() => handlePermissionChange('canCreateCourse')}
              />
              Create Courses
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canEditCourse || false}
                onChange={() => handlePermissionChange('canEditCourse')}
              />
              Edit Courses
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canDeleteCourse || false}
                onChange={() => handlePermissionChange('canDeleteCourse')}
              />
              Delete Courses
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canViewReports || false}
                onChange={() => handlePermissionChange('canViewReports')}
              />
              View Reports
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canManagePermissions || false}
                onChange={() => handlePermissionChange('canManagePermissions')}
              />
              Manage Permissions
            </label>
            <label>
              <input
                type="checkbox"
                checked={permissions.canViewProgress || false}
                onChange={() => handlePermissionChange('canViewProgress')}
              />
              View Progress
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit">Save Permissions</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
                <label>Class</label>
                <input type="text" name="class" value={formData.class || ''} onChange={handleChange} required />
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
                <label>Teacher ID</label>
                <input type="text" name="teacherId" value={formData.teacherId || ''} onChange={handleChange} required />
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

  // Available subjects for teachers
  const availableSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Economics',
    'Art',
    'Music',
    'Physical Education'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (subject) => {
    const currentSubjects = formData.subjects || [];
    const updatedSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject];

    setFormData({ ...formData, subjects: updatedSubjects });
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
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Class</label>
                <input type="text" name="class" value={formData.class || ''} onChange={handleChange} required />
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
                <label>Teacher ID</label>
                <input type="text" name="teacherId" value={formData.teacherId || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Allowed Subjects (Check all that apply)</label>
                <div className="subjects-checkboxes">
                  {availableSubjects.map(subject => (
                    <label key={subject} className="subject-checkbox">
                      <input
                        type="checkbox"
                        checked={(formData.subjects || []).includes(subject)}
                        onChange={() => handleSubjectChange(subject)}
                      />
                      {subject}
                    </label>
                  ))}
                </div>
                <small className="form-help">Selected subjects: {(formData.subjects || []).join(', ') || 'None'}</small>
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
                <label>Teacher ID</label>
                <input type="text" name="teacherId" value={formData.teacherId || ''} onChange={handleChange} required />
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

const SuperAdminDashboard = ({ username, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState({});
  const [editModal, setEditModal] = useState({ isOpen: false, item: null, type: '' });
  const [addModal, setAddModal] = useState({ isOpen: false, type: '' });
  const [permissionModal, setPermissionModal] = useState({ isOpen: false, user: null });
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const statsRes = await fetch('http://localhost:5001/api/superadmin/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else if (statsRes.status === 403) {
        const errorData = await statsRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        }
      }

      const studentsRes = await fetch('http://localhost:5001/api/superadmin/students', { headers });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      } else if (studentsRes.status === 403) {
        const errorData = await studentsRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        }
      }

      const teachersRes = await fetch('http://localhost:5001/api/superadmin/teachers', { headers });
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setTeachers(teachersData);
      } else if (teachersRes.status === 403) {
        const errorData = await teachersRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        }
      }

      const coursesRes = await fetch('http://localhost:5001/api/superadmin/courses', { headers });
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      } else if (coursesRes.status === 403) {
        const errorData = await coursesRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        }
      }

      const usersRes = await fetch('http://localhost:5001/api/superadmin/users', { headers });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      } else if (usersRes.status === 403) {
        const errorData = await usersRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        }
      }

      const paymentsRes = await fetch('http://localhost:5001/api/superadmin/payments', { headers });
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      } else if (paymentsRes.status === 403) {
        const errorData = await paymentsRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        }
      }

      const reportsRes = await fetch('http://localhost:5001/api/superadmin/reports', { headers });
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData);
      } else if (reportsRes.status === 403) {
        const errorData = await reportsRes.json();
        if (errorData.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserInfo(errorData.user);
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Error fetching dashboard data: ' + error.message);
    }
  };

  const handlePasswordChanged = () => {
    setRequirePasswordChange(false);
    setUserInfo(null);
    fetchDashboardData();
  };

  const handleEdit = (item, type) => {
    setEditModal({ isOpen: true, item, type });
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'Student' ? 'students' : type === 'Teacher' ? 'teachers' : 'courses';
      const response = await fetch(`http://localhost:5001/api/superadmin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert(`${type} deleted successfully`);
        fetchDashboardData();
      } else {
        alert(`Failed to delete ${type.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Error deleting ${type.toLowerCase()}`);
    }
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const { id } = updatedData;
      const endpoint = editModal.type === 'Student' ? 'students' : editModal.type === 'Teacher' ? 'teachers' : 'courses';
      const response = await fetch(`http://localhost:5001/api/superadmin/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        alert(`${editModal.type} updated successfully`);
        fetchDashboardData();
      } else {
        alert(`Failed to update ${editModal.type.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error updating ${editModal.type}:`, error);
      alert(`Error updating ${editModal.type.toLowerCase()}`);
    }
  };

  const handleAdd = (type) => {
    setAddModal({ isOpen: true, type });
  };

  const handleSaveAdd = async (newData) => {
    try {
      console.log('Adding new data:', newData); // Debug log
      const token = localStorage.getItem('token');
      const endpoint = addModal.type === 'Student' ? 'students' : addModal.type === 'Teacher' ? 'teachers' : 'courses';

      // Process the data before sending
      let processedData = { ...newData };

      if (addModal.type === 'Teacher' && newData.subjects) {
        // Subjects should already be an array from the checkboxes
        processedData.subjects = Array.isArray(newData.subjects) ? newData.subjects : [];
      }

      console.log('Processed data:', processedData); // Debug log

      const response = await fetch(`http://localhost:5001/api/superadmin/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(processedData)
      });

      console.log('Response status:', response.status); // Debug log
      const responseData = await response.text();
      console.log('Response data:', responseData); // Debug log

      if (response.ok) {
        alert(`${addModal.type} added successfully`);
        setAddModal({ isOpen: false, type: '' });
        fetchDashboardData();
      } else {
        try {
          const errorData = JSON.parse(responseData);
          alert(`Failed to add ${addModal.type.toLowerCase()}: ${errorData.message}`);
        } catch {
          alert(`Failed to add ${addModal.type.toLowerCase()}: ${responseData}`);
        }
      }
    } catch (error) {
      console.error(`Error adding ${addModal.type}:`, error);
      alert(`Error adding ${addModal.type.toLowerCase()}: ${error.message}`);
    }
  };

  const handleManagePermissions = (user) => {
    setPermissionModal({ isOpen: true, user });
  };

  const handleSavePermissions = async (userId, permissions) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/superadmin/users/${userId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ permissions })
      });

      if (response.ok) {
        alert('Permissions updated successfully');
        fetchDashboardData();
      } else {
        alert('Failed to update permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Error updating permissions');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/superadmin/users/${userId}/deactivate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('User deactivated successfully');
        fetchDashboardData();
      } else {
        alert('Failed to deactivate user');
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user');
    }
  };

  const handleActivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to activate this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/superadmin/users/${userId}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('User activated successfully');
        fetchDashboardData();
      } else {
        alert('Failed to activate user');
      }
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Error activating user');
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <h2>SuperAdmin Dashboard Overview</h2>
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
          <h3>Total Admins</h3>
          <p className="stat-number">{stats.totalAdmins || 0}</p>
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
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => setActiveSection('students')}>Manage Students</button>
          <button onClick={() => setActiveSection('teachers')}>Manage Teachers</button>
          <button onClick={() => setActiveSection('courses')}>Manage Courses</button>
          <button onClick={() => setActiveSection('users')}>Manage Users</button>
          <button onClick={() => setActiveSection('reports')}>View Reports</button>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="students-section">
      <h2>Student Management</h2>
      <button onClick={() => handleAdd('Student')} className="add-button">Add Student</button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student._id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.class}</td>
                <td>
                  <button onClick={() => handleEdit(student, 'Student')}>Edit</button>
                  <button onClick={() => handleDelete(student._id, 'Student')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTeachers = () => (
    <div className="teachers-section">
      <h2>Teacher Management</h2>
      <button onClick={() => handleAdd('Teacher')} className="add-button">Add Teacher</button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Teacher ID</th>
              <th>Allowed Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher._id}>
                <td>{teacher._id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.teacherId}</td>
                <td>
                  <div className="subjects-list">
                    {(teacher.subjects || []).length > 0 ? (
                      <div className="subject-tags">
                        {(teacher.subjects || []).map((subject, index) => (
                          <span key={index} className="subject-tag">
                            {subject}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-subjects">No subjects assigned</span>
                    )}
                  </div>
                </td>
                <td>
                  <button onClick={() => handleEdit(teacher, 'Teacher')}>Edit</button>
                  <button onClick={() => handleDelete(teacher._id, 'Teacher')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="courses-section">
      <h2>Course Management</h2>
      <button onClick={() => handleAdd('Course')} className="add-button">Add Course</button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Teacher</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id}>
                <td>{course._id}</td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>{course.teacherId}</td>
                <td>{course.progress}%</td>
                <td>
                  <button onClick={() => handleEdit(course, 'Course')}>Edit</button>
                  <button onClick={() => handleDelete(course._id, 'Course')}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <h2>User Management</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => handleManagePermissions(user)}>Permissions</button>
                  {user.isActive ? (
                    <button onClick={() => handleDeactivateUser(user._id)}>Deactivate</button>
                  ) : (
                    <button onClick={() => handleActivateUser(user._id)}>Activate</button>
                  )}
                </td>
              </tr>
            ))}
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
          <h3>Course Enrollment</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reports.courseEnrollment || []}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
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
      case 'users':
        return renderUsers();
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
          <h2>SuperAdmin Panel</h2>
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
            <li className={activeSection === 'users' ? 'active' : ''} onClick={() => setActiveSection('users')}>
              User Management
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
        {renderContent()}
      </div>
      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null, type: '' })}
        item={editModal.item}
        type={editModal.type}
        onSave={handleSaveEdit}
      />
      <AddModal
        isOpen={addModal.isOpen}
        onClose={() => setAddModal({ isOpen: false, type: '' })}
        type={addModal.type}
        onSave={handleSaveAdd}
      />
      <PermissionModal
        isOpen={permissionModal.isOpen}
        onClose={() => setPermissionModal({ isOpen: false, user: null })}
        user={permissionModal.user}
        onSave={handleSavePermissions}
      />
    </div>
  );
};

export default SuperAdminDashboard;