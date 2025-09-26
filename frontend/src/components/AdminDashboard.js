import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    console.log('fetchDashboardData called');
    try {
      const statsRes = await fetch('http://localhost:5001/api/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      const studentsRes = await fetch('http://localhost:5001/api/admin/students');
      const studentsData = await studentsRes.json();
      setStudents(studentsData);

      const teachersRes = await fetch('http://localhost:5001/api/admin/teachers');
      const teachersData = await teachersRes.json();
      setTeachers(teachersData);

      const coursesRes = await fetch('http://localhost:5001/api/admin/courses');
      const coursesData = await coursesRes.json();
      setCourses(coursesData);

      const paymentsRes = await fetch('http://localhost:5001/api/admin/payments');
      const paymentsData = await paymentsRes.json();
      setPayments(paymentsData);

      const reportsRes = await fetch('http://localhost:5001/api/admin/reports');
      const reportsData = await reportsRes.json();
      setReports(reportsData);

      console.log('Fetched data:', { studentsData, teachersData, coursesData });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Error fetching dashboard data: ' + error.message);
    }
  };

  const handleEdit = (item, type) => {
    setEditModal({ isOpen: true, item, type });
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) return;

    try {
      const endpoint = type === 'Student' ? 'students' : type === 'Teacher' ? 'teachers' : 'courses';
      const response = await fetch(`http://localhost:5001/api/admin/${endpoint}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert(`${type} deleted successfully`);
        fetchDashboardData(); // Refresh data
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

  const handleAdd = (type) => {
    setAddModal({ isOpen: true, type });
  };

  const handleSaveAdd = async (newData) => {
    console.log('handleSaveAdd called with', newData, 'type', addModal.type);
    try {
      let payload = { ...newData };
      if (addModal.type === 'Student') {
        // For students, ensure only class is used, remove course if present
        delete payload.course;
      }
      const endpoint = addModal.type === 'Student' ? 'students' : addModal.type === 'Teacher' ? 'teachers' : 'courses';
      console.log('Posting to', `http://localhost:5001/api/admin/${endpoint}`);
      const response = await fetch(`http://localhost:5001/api/admin/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        alert(`${addModal.type} added successfully`);
        console.log('Calling fetchDashboardData');
        fetchDashboardData(); // Refresh data
      } else {
        alert(`Failed to add ${addModal.type.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error adding ${addModal.type}:`, error);
      alert(`Error adding ${addModal.type.toLowerCase()}`);
    }
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
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => setActiveSection('students')}>Manage Students</button>
          <button onClick={() => setActiveSection('teachers')}>Manage Teachers</button>
          <button onClick={() => setActiveSection('courses')}>Manage Courses</button>
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
              <th>Class (8-12)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.class}</td>
                <td>
                  <button onClick={() => handleEdit(student, 'Student')}>Edit</button>
                  <button onClick={() => handleDelete(student.id, 'Student')}>Delete</button>
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
              <th>Subject</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.subject}</td>
                <td>{teacher.students?.length || 0}</td>
                <td>
                  <button onClick={() => handleEdit(teacher, 'Teacher')}>Edit</button>
                  <button onClick={() => handleDelete(teacher.id, 'Teacher')}>Delete</button>
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
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>{course.teacherId}</td>
                <td>{course.progress}%</td>
                <td>
                  <button onClick={() => handleEdit(course, 'Course')}>Edit</button>
                  <button onClick={() => handleDelete(course.id, 'Course')}>Delete</button>
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
    </div>
  );
};

export default AdminDashboard;
