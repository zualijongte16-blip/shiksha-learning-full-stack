import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

const TeacherDashboard = ({ username, onLogout }) => {
  const navigate = useNavigate();

  console.log('🚀 MODERN TEACHER DASHBOARD LOADED!');
  console.log('Username:', username);
  console.log('Teacher ID from localStorage:', localStorage.getItem('teacherId'));

  // --- STATE ---
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tests, setTests] = useState([]);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for Upload Modal & Form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newMaterialData, setNewMaterialData] = useState({
    title: '',
    description: '',
    courseId: '',
    class: '',
    subject: '',
  });
  const [newTestData, setNewTestData] = useState({
    title: '',
    description: '',
    courseId: '',
    questions: [],
    duration: 60
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchTeacherData = useCallback(async () => {
    try {
      const teacherId = localStorage.getItem('teacherId') || username;
      console.log('🔍 Fetching data for teacher ID:', teacherId);

      // Fetch teacher permissions and assigned courses
      const teacherResponse = await fetch(`http://localhost:5001/api/admin/teachers/${teacherId}`);
      if (teacherResponse.ok) {
        const teacher = await teacherResponse.json();
        console.log('👨‍🏫 Teacher data loaded:', teacher);
        setTeacherData(teacher);
      } else {
        console.log('❌ Teacher data not found');
      }

      // Fetch courses assigned to this teacher
      const coursesResponse = await fetch(`http://localhost:5001/api/admin/courses?teacherId=${teacherId}`);
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        console.log('📚 Courses loaded:', coursesData.length);
        setCourses(coursesData);
      }

      // Fetch materials uploaded by this teacher
      const materialsResponse = await fetch(`http://localhost:5001/api/materials/teacher/${teacherId}`);
      if (materialsResponse.ok) {
        const materialsData = await materialsResponse.json();
        console.log('📄 Materials loaded:', materialsData.length);
        setMaterials(materialsData);
      }

      // Fetch tests created by this teacher
      const testsResponse = await fetch(`http://localhost:5001/api/tests/teacher/${teacherId}`);
      if (testsResponse.ok) {
        const testsData = await testsResponse.json();
        console.log('📝 Tests loaded:', testsData.length);
        setTests(testsData);
      }

    } catch (error) {
      console.error('❌ Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // --- EFFECTS ---
  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  // --- HANDLERS ---
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

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
    if (!selectedFile || !newMaterialData.courseId || !newMaterialData.title || !newMaterialData.class || !newMaterialData.subject) {
      alert('Please fill out all required fields: title, course, class, subject, and choose a file.');
      return;
    }

    // Check permissions
    if (!teacherData?.permissions?.canUploadMaterials) {
      alert('You do not have permission to upload materials.');
      return;
    }

    // FormData is required for sending files
    const formData = new FormData();
    formData.append('title', newMaterialData.title);
    formData.append('description', newMaterialData.description);
    formData.append('courseId', newMaterialData.courseId);
    formData.append('class', newMaterialData.class);
    formData.append('subject', newMaterialData.subject);
    formData.append('teacherId', localStorage.getItem('teacherId') || username);
    formData.append('materialFile', selectedFile);

    try {
      const response = await fetch('http://localhost:5001/api/materials/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Material uploaded successfully!');
        setShowUploadModal(false);
        setNewMaterialData({ title: '', description: '', courseId: '', class: '', subject: '' });
        setSelectedFile(null);
        fetchTeacherData(); // Refresh data
      } else {
        throw new Error(result.message || 'Failed to upload material.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message);
    }
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();

    if (!teacherData?.permissions?.canCreateTests) {
      alert('You do not have permission to create tests.');
      return;
    }

    if (!newTestData.title || !newTestData.courseId || newTestData.questions.length === 0) {
      alert('Please fill out the title, select a course, and add at least one question.');
      return;
    }

    const testData = {
      ...newTestData,
      teacherId: localStorage.getItem('teacherId') || username
    };

    try {
      const response = await fetch('http://localhost:5001/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Test created successfully!');
        setShowTestModal(false);
        setNewTestData({ title: '', description: '', courseId: '', questions: [], duration: 60 });
        fetchTeacherData(); // Refresh data
      } else {
        throw new Error(result.message || 'Failed to create test.');
      }
    } catch (error) {
      console.error('Test creation error:', error);
      alert(error.message);
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setNewMaterialData({
      title: material.title,
      description: material.description || '',
      courseId: material.courseId,
      class: material.class || '',
      subject: material.subject || '',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!teacherData?.permissions?.canUploadMaterials) {
      alert('You do not have permission to edit materials.');
      return;
    }

    const updateData = {
      title: newMaterialData.title,
      description: newMaterialData.description,
      courseId: newMaterialData.courseId,
      class: newMaterialData.class,
      subject: newMaterialData.subject,
    };

    try {
      const response = await fetch(`http://localhost:5001/api/materials/${editingMaterial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Material updated successfully!');
        setShowEditModal(false);
        setEditingMaterial(null);
        setNewMaterialData({ title: '', description: '', courseId: '', class: '', subject: '' });
        fetchTeacherData(); // Refresh data
      } else {
        throw new Error(result.message || 'Failed to update material.');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.message);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/materials/${materialId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Material deleted successfully!');
        fetchTeacherData(); // Refresh data
      } else {
        throw new Error('Failed to delete material.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message);
    }
  };

  const handleConductTest = async (testId) => {
    if (!teacherData?.permissions?.canCreateTests) {
      alert('You do not have permission to conduct tests.');
      return;
    }

    try {
      // Start the test session
      const response = await fetch(`http://localhost:5001/api/tests/${testId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: localStorage.getItem('teacherId') || username }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Test started successfully! Test ID: ${result.testSessionId}`);
        fetchTeacherData(); // Refresh data
      } else {
        throw new Error(result.message || 'Failed to start test.');
      }
    } catch (error) {
      console.error('Test conduct error:', error);
      alert(error.message);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/tests/${testId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Test deleted successfully!');
        fetchTeacherData(); // Refresh data
      } else {
        throw new Error('Failed to delete test.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message);
    }
  };

  const addQuestion = () => {
    setNewTestData(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }]
    }));
  };

  const updateQuestion = (index, field, value) => {
    setNewTestData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };



  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="teacher-dashboard-container">
      {/* Dark Mode Toggle */}
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <aside className="sidebar">
        <div className="logo-placeholder" onClick={() => navigate('/')}>
          <img
            src={`${process.env.PUBLIC_URL}/images/Shiksa_logo.png`}
            alt="Shiksha Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              marginRight: '0.5rem',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              console.log('Logo failed to load, hiding image');
            }}
          />
          <span>Shiksha</span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            📚 Courses
          </button>
          <button
            className={`nav-link ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            📄 Materials
          </button>
          <button
            className={`nav-link ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            📝 Tests
          </button>
          <button
            className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>
        <button className="logout-button" onClick={onLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1>Welcome Back, {teacherData?.name || username}! 👋</h1>
            <p style={{ color: 'var(--secondary-text)', margin: '0.5rem 0 0 0', fontSize: '1rem' }}>
              {teacherData?.name === 'Evelyn Johnson' ?
                "Ready to inspire young minds? Let's make today amazing!" :
                "Ready to inspire and educate? Let's make learning amazing today!"
              }
            </p>
          </div>
          <div className="header-actions">
            {activeTab === 'materials' && teacherData?.permissions?.canUploadMaterials && (
              <button className="action-btn upload-btn" onClick={() => setShowUploadModal(true)}>
                <span>📤</span> Upload Material
              </button>
            )}
            {activeTab === 'tests' && teacherData?.permissions?.canCreateTests && (
              <button className="action-btn create-btn" onClick={() => setShowTestModal(true)}>
                <span>📝</span> Create Test
              </button>
            )}
            {activeTab === 'courses' && teacherData?.permissions?.canManageStudents && (
              <button className="action-btn manage-btn">
                <span>👥</span> Manage Students
              </button>
            )}
          </div>
        </header>

        <div className="dashboard-content">
            {/* Modern Stats Overview */}
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-number">{courses.length}</div>
                <div className="stat-label">Courses</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{materials.length}</div>
                <div className="stat-label">Materials</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{tests.length}</div>
                <div className="stat-label">Tests</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {courses.reduce((total, course) => total + (course.enrolledStudents?.length || 0), 0)}
                </div>
                <div className="stat-label">Students</div>
              </div>
            </div>

            {activeTab === 'courses' && (
            <div className="courses-container">
              <h2>Your Assigned Courses</h2>
              <div className="courses-grid">
                {courses.map((course) => (
                  <div key={course._id || course.id} className="course-card">
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                    <div className="course-info">
                      <span>Students: {course.enrolledStudents?.length || 0}</span>
                      <span>Progress: {course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
           <div className="materials-container">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h2>📄 Your Materials</h2>
               {teacherData?.permissions?.canUploadMaterials && (
                 <button
                   className="action-btn upload-btn"
                   onClick={() => setShowUploadModal(true)}
                   style={{ fontSize: '0.9rem', padding: '0.75rem 1.25rem' }}
                 >
                   <span>➕</span> Upload New Material
                 </button>
               )}
             </div>
             <div className="materials-list">
               {materials.map((material) => (
                 <div key={material.id} className="material-item">
                   <div className="material-info">
                     <h3>{material.title}</h3>
                     <p>{material.description}</p>
                     <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                       <span style={{
                         display: 'inline-block',
                         background: 'var(--light-blue-bg)',
                         padding: '0.25rem 0.75rem',
                         borderRadius: '12px',
                         fontSize: '0.8rem',
                         fontWeight: '500',
                         color: 'var(--accent-blue)'
                       }}>
                         📚 {courses.find(c => c.id === material.courseId)?.name || 'Unknown Course'}
                       </span>
                       <span style={{
                         display: 'inline-block',
                         background: 'var(--green-status-bg)',
                         padding: '0.25rem 0.75rem',
                         borderRadius: '12px',
                         fontSize: '0.8rem',
                         fontWeight: '500',
                         color: 'var(--green-status)'
                       }}>
                         🏫 {material.class || 'No Class'}
                       </span>
                       <span style={{
                         display: 'inline-block',
                         background: 'var(--blue-status-bg)',
                         padding: '0.25rem 0.75rem',
                         borderRadius: '12px',
                         fontSize: '0.8rem',
                         fontWeight: '500',
                         color: 'var(--blue-status)'
                       }}>
                         📖 {material.subject || 'No Subject'}
                       </span>
                     </div>
                   </div>
                   <div className="material-actions">
                     <button
                       className="download-btn"
                       onClick={() => window.open(`http://localhost:5001${material.fileUrl}`, '_blank')}
                     >
                       📥 Download
                     </button>
                     <button
                       className="edit-btn"
                       onClick={() => handleEditMaterial(material)}
                     >
                       ✏️ Edit
                     </button>
                     <button
                       className="delete-btn"
                       onClick={() => handleDeleteMaterial(material.id)}
                     >
                       🗑️ Delete
                     </button>
                   </div>
                 </div>
               ))}
               {materials.length === 0 && (
                 <div style={{
                   textAlign: 'center',
                   padding: '3rem',
                   color: 'var(--secondary-text)',
                   fontSize: '1.1rem'
                 }}>
                   📭 No materials uploaded yet. Click "Upload Material" to get started!
                 </div>
               )}
             </div>
           </div>
         )}

          {activeTab === 'tests' && (
            <div className="tests-container">
              <h2>📝 Your Tests</h2>
              <div className="tests-list">
                {tests.map((test) => (
                  <div key={test._id} className="test-item">
                    <div className="test-info">
                      <h3>{test.title}</h3>
                      <p>{test.description}</p>
                      <div className="test-details">
                        <span>❓ {test.questions?.length || 0} Questions</span>
                        <span>⏱️ {test.duration} min</span>
                        <span>⭐ {test.totalPoints || 'N/A'} Points</span>
                      </div>
                    </div>
                    <div className="test-actions">
                      <button
                        className="conduct-btn"
                        onClick={() => handleConductTest(test._id)}
                      >
                        🎯 Conduct
                      </button>
                      <button className="edit-btn">
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteTest(test._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
                {tests.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'var(--secondary-text)',
                    fontSize: '1.1rem'
                  }}>
                    📝 No tests created yet. Click "Create Test" to assess your students!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-container">
              <h2>⚙️ Account Settings</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                <div style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'var(--backdrop-blur)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  padding: '2rem',
                  boxShadow: 'var(--box-shadow)'
                }}>
                  <h3 style={{
                    color: 'var(--primary-text)',
                    margin: '0 0 1.5rem 0',
                    fontSize: '1.25rem'
                  }}>
                    🔐 Your Permissions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--light-blue-bg)',
                      borderRadius: '12px'
                    }}>
                      <span>📤 Upload Materials</span>
                      <span style={{
                        color: teacherData?.permissions?.canUploadMaterials ? 'var(--green-status)' : 'var(--secondary-text)',
                        fontWeight: '600'
                      }}>
                        {teacherData?.permissions?.canUploadMaterials ? '✅ Enabled' : '❌ Disabled'}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--light-blue-bg)',
                      borderRadius: '12px'
                    }}>
                      <span>📝 Create Tests</span>
                      <span style={{
                        color: teacherData?.permissions?.canCreateTests ? 'var(--green-status)' : 'var(--secondary-text)',
                        fontWeight: '600'
                      }}>
                        {teacherData?.permissions?.canCreateTests ? '✅ Enabled' : '❌ Disabled'}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--light-blue-bg)',
                      borderRadius: '12px'
                    }}>
                      <span>👥 Manage Students</span>
                      <span style={{
                        color: teacherData?.permissions?.canManageStudents ? 'var(--green-status)' : 'var(--secondary-text)',
                        fontWeight: '600'
                      }}>
                        {teacherData?.permissions?.canManageStudents ? '✅ Enabled' : '❌ Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'var(--backdrop-blur)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  padding: '2rem',
                  boxShadow: 'var(--box-shadow)'
                }}>
                  <h3 style={{
                    color: 'var(--primary-text)',
                    margin: '0 0 1.5rem 0',
                    fontSize: '1.25rem'
                  }}>
                    📚 Your Assignments
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--secondary-text)' }}>Classes</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {teacherData?.assignedClasses?.length > 0 ? (
                          teacherData.assignedClasses.map(cls => (
                            <span key={cls} style={{
                              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: '500'
                            }}>
                              {cls}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                            No classes assigned
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--secondary-text)' }}>Subjects</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {teacherData?.subjects?.length > 0 ? (
                          teacherData.subjects.map(subject => (
                            <span key={subject} style={{
                              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: '500'
                            }}>
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                            No subjects assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                <label htmlFor="class">Class</label>
                <select
                  id="class"
                  name="class"
                  value={newMaterialData.class}
                  onChange={handleMaterialChange}
                  required
                >
                  <option value="" disabled>Select a class</option>
                  <option value="Grade 10A">Grade 10A</option>
                  <option value="Grade 10B">Grade 10B</option>
                  <option value="Grade 11A">Grade 11A</option>
                  <option value="Grade 11B">Grade 11B</option>
                  <option value="Grade 12A">Grade 12A</option>
                  <option value="Grade 12B">Grade 12B</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={newMaterialData.subject}
                  onChange={handleMaterialChange}
                  required
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
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

      {/* --- EDIT MATERIAL MODAL --- */}
      {showEditModal && editingMaterial && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Edit Material</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="editTitle">Title</label>
                <input
                  type="text"
                  id="editTitle"
                  name="title"
                  value={newMaterialData.title}
                  onChange={handleMaterialChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editDescription">Description (Optional)</label>
                <textarea
                  id="editDescription"
                  name="description"
                  value={newMaterialData.description}
                  onChange={handleMaterialChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editCourseId">Course</label>
                <select
                  id="editCourseId"
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
                <label htmlFor="editClass">Class</label>
                <select
                  id="editClass"
                  name="class"
                  value={newMaterialData.class}
                  onChange={handleMaterialChange}
                  required
                >
                  <option value="" disabled>Select a class</option>
                  <option value="Grade 10A">Grade 10A</option>
                  <option value="Grade 10B">Grade 10B</option>
                  <option value="Grade 11A">Grade 11A</option>
                  <option value="Grade 11B">Grade 11B</option>
                  <option value="Grade 12A">Grade 12A</option>
                  <option value="Grade 12B">Grade 12B</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editSubject">Subject</label>
                <select
                  id="editSubject"
                  name="subject"
                  value={newMaterialData.subject}
                  onChange={handleMaterialChange}
                  required
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowEditModal(false);
                  setEditingMaterial(null);
                  setNewMaterialData({ title: '', description: '', courseId: '' });
                }}>Cancel</button>
                <button type="submit" className="submit-btn">Update Material</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TEST CREATION MODAL --- */}
      {showTestModal && (
        <div className="modal-overlay" onClick={() => setShowTestModal(false)}>
          <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Test</h2>
            <form onSubmit={handleTestSubmit}>
              <div className="form-group">
                <label htmlFor="testTitle">Test Title</label>
                <input
                  type="text"
                  id="testTitle"
                  value={newTestData.title}
                  onChange={(e) => setNewTestData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="testDescription">Description (Optional)</label>
                <textarea
                  id="testDescription"
                  value={newTestData.description}
                  onChange={(e) => setNewTestData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="testCourseId">Course</label>
                <select
                  id="testCourseId"
                  value={newTestData.courseId}
                  onChange={(e) => setNewTestData(prev => ({ ...prev, courseId: e.target.value }))}
                  required
                >
                  <option value="" disabled>Select a course</option>
                  {courses.map(course => (
                    <option key={course._id || course.id} value={course._id || course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  value={newTestData.duration}
                  onChange={(e) => setNewTestData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  min="1"
                  required
                />
              </div>

              <div className="questions-section">
                <h3>Questions</h3>
                {newTestData.questions.map((question, index) => (
                  <div key={index} className="question-item">
                    <div className="form-group">
                      <label>Question {index + 1}</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        placeholder="Enter question"
                        required
                      />
                    </div>
                    <div className="options-group">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="option-item">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() => updateQuestion(index, 'correctAnswer', optIndex)}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(index, 'options', newOptions);
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <div className="form-group">
                      <label>Points</label>
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="add-question-btn" onClick={addQuestion}>
                  + Add Question
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowTestModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Create Test</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
