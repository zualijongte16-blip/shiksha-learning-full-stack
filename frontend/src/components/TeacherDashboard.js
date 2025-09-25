import React, { useState } from 'react';
import './TeacherDashboard.css';

const TeacherDashboard = ({ username, onLogout }) => {
  // --- STATE ---
  const [courses] = useState([
    { id: 1, name: 'Mathematics', status: 'In Progress' },
    { id: 2, name: 'History', status: 'Completed' },
    { id: 3, name: 'Computer Science', status: 'Completed' },
  ]);

  // State for Upload Modal & Form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMaterialData, setNewMaterialData] = useState({
    title: '',
    description: '',
    courseId: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // --- HANDLERS for Upload Form ---
  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setNewMaterialData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !newMaterialData.courseId || !newMaterialData.title) {
      alert('Please fill out the title, select a course, and choose a file.');
      return;
    }

    // FormData is required for sending files
    const formData = new FormData();
    formData.append('title', newMaterialData.title);
    formData.append('description', newMaterialData.description);
    formData.append('courseId', newMaterialData.courseId);
    formData.append('teacherId', username); // Assuming username is the teacher's ID
    formData.append('materialFile', selectedFile); // This key 'materialFile' MUST match the backend

    try {
      // This URL matches your server.js setup
      const response = await fetch('http://localhost:5001/api/materials/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Material uploaded successfully!');
        setShowUploadModal(false);
        // Clear the form for the next upload
        setNewMaterialData({ title: '', description: '', courseId: '' });
        setSelectedFile(null);
      } else {
        throw new Error(result.message || 'Failed to upload material.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="teacher-dashboard-container">
      <aside className="sidebar">
        <div className="logo-placeholder">Shiksha</div>
        <nav className="sidebar-nav">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#courses" className="nav-link">Courses</a>
          <a href="#schedule" className="nav-link">Schedule</a>
          <a href="#assignment" className="nav-link">Assignment</a>
          <a href="#settings" className="nav-link">Account & Settings</a>
        </nav>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Welcome Back, Teacher!</h1>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <button>Search</button>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-number">{courses.length}</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4</span>
              <span className="stat-label">Assignments</span>
            </div>
          </div>
          
          <div className="courses-container">
            <div className="courses-header">
                <h2>Your Courses</h2>
                <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
                    + Upload Material
                </button>
            </div>
            <div className="courses-list">
              {courses.map((course) => (
                <div key={course.id} className="course-item">
                  <span>{course.name}</span>
                  <span className={`status-badge ${getStatusClass(course.status)}`}>
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- UPLOAD MODAL --- */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Upload New Material</h2>
            <form onSubmit={handleMaterialSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newMaterialData.title}
                  onChange={handleMaterialChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={newMaterialData.description}
                  onChange={handleMaterialChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="courseId">Course</label>
                <select
                  id="courseId"
                  name="courseId"
                  value={newMaterialData.courseId}
                  onChange={handleMaterialChange}
                  required
                >
                  <option value="" disabled>Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="materialFile">File</label>
                <input
                  type="file"
                  id="materialFile"
                  name="materialFile"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;