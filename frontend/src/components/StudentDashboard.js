import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = ({ username, onLogout }) => {
  const navigate = useNavigate();


  // --- NEW STATE FOR SHIKSHA DASHBOARD ---
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get user's first name from username/email
  const getUserFirstName = (username) => {
    if (!username) return 'Student';
    // If username contains email format, extract name part
    if (username.includes('@')) {
      return username.split('@')[0].split('.')[0];
    }
    // If username has spaces or camelCase, format it
    return username.split(' ')[0].split('.')[0];
  };

  const userDisplayName = getUserFirstName(username);

  // Sample data for stats cards - Subject specific
  const [statsData] = useState([
    {
      id: 1,
      title: 'Chapters in Progress',
      value: '8',
      icon: '📖',
      color: 'orange',
      bgColor: 'rgba(255, 107, 53, 0.1)'
    },
    {
      id: 2,
      title: 'Chapters Completed',
      value: '24',
      icon: '✅',
      color: 'green',
      bgColor: 'rgba(34, 197, 94, 0.1)'
    },
    {
      id: 3,
      title: 'Tests Passed',
      value: '12',
      icon: '🏆',
      color: 'blue',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      id: 4,
      title: 'Study Streak',
      value: '15',
      icon: '🔥',
      color: 'purple',
      bgColor: 'rgba(147, 51, 234, 0.1)'
    }
  ]);

  // Activity Hours data
  const [activityData] = useState([
    { day: 'S', hours: 2 },
    { day: 'M', hours: 4 },
    { day: 'T', hours: 3 },
    { day: 'W', hours: 8 },
    { day: 'T', hours: 6 },
    { day: 'F', hours: 5 },
    { day: 'S', hours: 7 }
  ]);

  // Performance data (mock data for the chart)
  const [performanceData] = useState([
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 82 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 88 },
    { month: 'Jun', value: 92 }
  ]);

  // Subject/Chapter assignments data
  const [assignmentsData] = useState([
    {
      id: 1,
      task: 'English Chapter 1: Parts of Speech',
      grade: '85/100',
      status: 'Completed',
      dueDate: 'Today, 10:30 AM',
      icon: '📝',
      subject: 'English',
      chapter: 'Chapter 1'
    },
    {
      id: 2,
      task: 'Mathematics Chapter 3: Algebra Basics',
      grade: '92/100',
      status: 'Completed',
      dueDate: 'Yesterday, 2:30 PM',
      icon: '🧮',
      subject: 'Mathematics',
      chapter: 'Chapter 3'
    },
    {
      id: 3,
      task: 'Science Chapter 2: Cell Structure',
      grade: '-/100',
      status: 'In Progress',
      dueDate: 'Tomorrow, 9:00 AM',
      icon: '🔬',
      subject: 'Science',
      chapter: 'Chapter 2'
    },
    {
      id: 4,
      task: 'History Chapter 1: Ancient India',
      grade: '78/100',
      status: 'Completed',
      dueDate: '2 days ago',
      icon: '📚',
      subject: 'History',
      chapter: 'Chapter 1'
    }
  ]);

  // Upcoming Events data
  const [eventsData] = useState([
    {
      id: 1,
      title: 'Team Meetup',
      type: 'meeting',
      date: 'Mon',
      time: '10:30'
    },
    {
      id: 2,
      title: 'Illustration',
      type: 'task',
      date: 'Tue',
      time: '11:30'
    },
    {
      id: 3,
      title: 'Research',
      type: 'research',
      date: 'Wed',
      time: '12:30'
    },
    {
      id: 4,
      title: 'Present',
      type: 'presentation',
      date: 'Thu',
      time: '13:30'
    },
    {
      id: 5,
      title: 'Report',
      type: 'report',
      date: 'Sat',
      time: '14:30'
    }
  ]);

  // Enrolled subjects and chapters (what student is actually taking)
  const [enrolledSubjects] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      chapters: [
        { id: 1, name: 'Chapter 1: Linear Equations', completed: true, progress: 100, lastAccessed: '2024-02-15' },
        { id: 2, name: 'Chapter 2: Polynomials', completed: true, progress: 100, lastAccessed: '2024-02-14' },
        { id: 3, name: 'Chapter 3: Algebra Basics', completed: true, progress: 92, lastAccessed: '2024-02-13' },
        { id: 4, name: 'Chapter 4: Quadratic Equations', completed: false, progress: 65, lastAccessed: '2024-02-16' },
        { id: 5, name: 'Chapter 5: Geometry', completed: false, progress: 0, lastAccessed: null }
      ],
      teacher: 'Prof. Sharma',
      overallProgress: 68
    },
    {
      id: 2,
      subject: 'English',
      chapters: [
        { id: 1, name: 'Chapter 1: Parts of Speech', completed: true, progress: 85, lastAccessed: '2024-02-13' },
        { id: 2, name: 'Chapter 2: Tenses', completed: false, progress: 45, lastAccessed: '2024-02-16' },
        { id: 3, name: 'Chapter 3: Sentences', completed: false, progress: 0, lastAccessed: null }
      ],
      teacher: 'Prof. Johnson',
      overallProgress: 43
    },
    {
      id: 3,
      subject: 'Physics',
      chapters: [
        { id: 1, name: 'Chapter 1: Motion', completed: true, progress: 78, lastAccessed: '2024-02-12' },
        { id: 2, name: 'Chapter 2: Forces', completed: false, progress: 30, lastAccessed: '2024-02-15' },
        { id: 3, name: 'Chapter 3: Laws of Motion', completed: false, progress: 0, lastAccessed: null }
      ],
      teacher: 'Prof. Kumar',
      overallProgress: 36
    },
    {
      id: 4,
      subject: 'Chemistry',
      chapters: [
        { id: 1, name: 'Chapter 1: Matter', completed: true, progress: 88, lastAccessed: '2024-02-11' },
        { id: 2, name: 'Chapter 2: Atoms', completed: false, progress: 0, lastAccessed: null }
      ],
      teacher: 'Prof. Singh',
      overallProgress: 44
    }
  ]);

  // Today's subjects assigned by teacher
  const [todaySubjects] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      chapter: 'Chapter 4: Quadratic Equations',
      teacher: 'Prof. Sharma',
      time: '09:00 AM - 10:30 AM',
      status: 'scheduled',
      completed: false
    },
    {
      id: 2,
      subject: 'English',
      chapter: 'Chapter 2: Tenses',
      teacher: 'Prof. Johnson',
      time: '11:00 AM - 12:30 PM',
      status: 'scheduled',
      completed: false
    }
  ]);

  // Completed subjects/chapters
  const [completedSubjects] = useState([
    { subject: 'Mathematics', chapter: 'Chapter 1: Linear Equations', completedDate: '2024-02-15' },
    { subject: 'Mathematics', chapter: 'Chapter 2: Polynomials', completedDate: '2024-02-14' },
    { subject: 'English', chapter: 'Chapter 1: Parts of Speech', completedDate: '2024-02-13' },
    { subject: 'Science', chapter: 'Chapter 1: Matter', completedDate: '2024-02-12' },
    { subject: 'History', chapter: 'Chapter 1: Ancient India', completedDate: '2024-02-11' }
  ]);

  // Test data for demonstration
  const [testResults] = useState([
    { test: 'Math Quiz 1', score: '85%', status: 'passed' },
    { test: 'Science Test', score: '92%', status: 'passed' },
    { test: 'English Exam', score: '78%', status: 'passed' }
  ]);

  // Handle test button click
  const handleTestClick = () => {
    alert('Test functionality - You can integrate with your testing system here!');
  };

  // Handle marking subject as complete
  const markSubjectComplete = (subjectId) => {
    // In a real app, this would make an API call to update the subject status
    alert(`Subject ${subjectId} marked as complete!`);
  };

  // Handle subject/chapter click
  const handleSubjectClick = (subjectName, chapter) => {
    // In a real app, this would navigate to the specific subject content
    alert(`Opening ${subjectName} - ${chapter}. Here you would see the actual lesson content, videos, materials, etc.`);
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  // --- NEW FUNCTIONS ---
  const handleNavClick = (navItem) => {
    setActiveNavItem(navItem);

    // Navigation routing using React Router
    switch(navItem) {
      case 'courses':
        navigate('/my-subjects');
        break;
      case 'chat':
        // For now, navigate to home - you can create a chat page later
        navigate('/');
        break;
      case 'grades':
        // For now, navigate to home - you can create a grades page later
        navigate('/');
        break;
      case 'schedule':
        // For now, navigate to home - you can create a schedule page later
        navigate('/');
        break;
      case 'settings':
        // For now, navigate to home - you can create a settings page later
        navigate('/');
        break;
      default:
        // Stay on dashboard
        break;
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  const getEventColor = (type) => {
    const colors = {
      meeting: '#FF6B35',
      task: '#1A202C',
      research: '#4299E1',
      presentation: '#FF6B35',
      report: '#48BB78'
    };
    return colors[type] || '#4299E1';
  };

  return (
    <div className="shiksha-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="shiksha-logo">
            <img
              src="/images/shikhsa_logo.png"
              alt="Shiksha Logo"
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo-icon">🎓</div>
            <span className="shiksha-name">Shiksha</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${activeNavItem === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'courses' ? 'active' : ''}`}
            onClick={() => handleNavClick('courses')}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">Courses</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'chat' ? 'active' : ''}`}
            onClick={() => handleNavClick('chat')}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-text">Chat</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'grades' ? 'active' : ''}`}
            onClick={() => handleNavClick('grades')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Grades</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'schedule' ? 'active' : ''}`}
            onClick={() => handleNavClick('schedule')}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-text">Schedule</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="premium-section">
            <div className="premium-illustration">
              <div className="student-graphic">👩‍🎓</div>
            </div>
            <div className="premium-text">
              <h4>Get Premium</h4>
              <p>Buy premium and get access to new courses</p>
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>

          {/* Completed Subjects Section */}
          <div className="completed-subjects-section">
            <div className="section-header">
              <h2>Recently Completed</h2>
              <span className="completed-badge">✓ {completedSubjects.length} chapters</span>
            </div>
            <div className="completed-list">
              {completedSubjects.slice(0, 5).map((subject, index) => (
                <div key={index} className="completed-item">
                  <div className="completed-icon">✅</div>
                  <div className="completed-info">
                    <h4>{subject.chapter}</h4>
                    <p>{subject.subject}</p>
                    <span className="completed-date">
                      Completed on {new Date(subject.completedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="greeting-section">
            <h1>Hello {userDisplayName} 👋</h1>
            <p>Let's learn something new today!</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <input type="text" placeholder="Search" />
              <button className="search-btn">🔍</button>
            </div>
            <button className="profile-btn">Profile</button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="content-wrapper">
            {/* Left Section */}
            <div className="left-section">
              {/* Overview Stats */}
              <div className="overview-section">
                <h2>Overview</h2>
                <div className="stats-grid">
                  {statsData.map((stat) => (
                    <div key={stat.id} className="stat-card">
                      <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                        <span>{stat.icon}</span>
                      </div>
                      <div className="stat-info">
                        <h3>{stat.value}</h3>
                        <p>{stat.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts Row */}
              <div className="charts-row">
                {/* Activity Hours */}
                <div className="activity-chart">
                  <div className="chart-header">
                    <h3>Activity Hours</h3>
                    <div className="chart-controls">
                      <select className="time-filter">
                        <option>Weekly</option>
                      </select>
                    </div>
                  </div>
                  <div className="chart-content">
                    <div className="activity-bars">
                      {activityData.map((item, index) => (
                        <div key={index} className="activity-bar">
                          <div className="bar">
                            <div
                              className="bar-fill"
                              style={{ height: `${(item.hours / 8) * 100}%` }}
                            ></div>
                          </div>
                          <span className="bar-label">{item.day}</span>
                        </div>
                      ))}
                    </div>
                    <div className="activity-stats">
                      <div className="stat-item">
                        <span className="stat-label">Time spent</span>
                        <span className="stat-value">28<span className="stat-unit">85%</span></span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Lessons taken</span>
                        <span className="stat-value">60<span className="stat-unit">78%</span></span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Exam passed</span>
                        <span className="stat-value">10<span className="stat-unit">100%</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="performance-chart">
                  <div className="chart-header">
                    <h3>Performance</h3>
                  </div>
                  <div className="performance-content">
                    <div className="performance-graph">
                      <svg viewBox="0 0 200 80" className="graph-svg">
                        <polyline
                          points="0,60 33,45 67,50 100,35 133,25 167,20 200,15"
                          className="graph-line"
                        />
                      </svg>
                    </div>
                    <div className="performance-labels">
                      {performanceData.map((item, index) => (
                        <span key={index} className="month-label">{item.month}</span>
                      ))}
                    </div>
                    <div className="performance-summary">
                      <p>Your productivity is <strong>40% higher</strong><br />compare to last month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Subjects */}
              <div className="today-subjects-section">
                <div className="section-header">
                  <h2>Today's Subjects</h2>
                  <span className="today-badge">Today</span>
                </div>
                <div className="subjects-list">
                  {todaySubjects.map((subject) => (
                    <div key={subject.id} className="subject-card">
                      <div className="subject-header">
                        <h3>{subject.subject}</h3>
                        <span className={`status-dot ${subject.completed ? 'completed' : 'pending'}`}>
                          {subject.completed ? '✓' : '○'}
                        </span>
                      </div>
                      <div className="subject-details">
                        <p className="chapter-name">{subject.chapter}</p>
                        <p className="teacher-info">👨‍🏫 {subject.teacher}</p>
                        <p className="time-info">🕐 {subject.time}</p>
                      </div>
                      {!subject.completed && (
                        <button className="mark-complete-btn" onClick={() => markSubjectComplete(subject.id)}>
                          Mark Complete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* My Assignments and Tests */}
              <div className="assignments-section">
                <div className="section-header">
                  <h2>Subject Progress</h2>
                </div>
                <div className="assignments-table">
                  <div className="table-header">
                    <span>TASK</span>
                    <span>GRADE</span>
                    <span>UPDATE</span>
                  </div>
                  <div className="table-body">
                    {assignmentsData.map((assignment) => (
                      <div key={assignment.id} className="table-row">
                        <div className="task-info">
                          <span className="task-icon">{assignment.icon}</span>
                          <div className="task-details">
                            <h4>{assignment.task}</h4>
                            <p>{assignment.dueDate}</p>
                            <div className="subject-tags">
                              <span className="subject-tag">{assignment.subject}</span>
                              <span className="chapter-tag">{assignment.chapter}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grade-info">
                          <span className="grade">{assignment.grade}</span>
                          <p>Final grade</p>
                        </div>
                        <div className="status-info">
                          <span className={`status-badge ${getStatusClass(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test Results Section */}
                <div className="test-results-section">
                  <div className="section-header">
                    <h2>Test Results</h2>
                    <button className="test-btn" onClick={handleTestClick}>
                      Take Test
                    </button>
                  </div>
                  <div className="test-results">
                    {testResults.map((test, index) => (
                      <div key={index} className="test-result-item">
                        <div className="test-info">
                          <h4>{test.test}</h4>
                          <span className={`test-status ${test.status}`}>
                            {test.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="test-score">
                          <span className="score">{test.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="right-section">
              {/* Calendar */}
              <div className="calendar-widget">
                <div className="calendar-header">
                  <span className="calendar-nav">‹</span>
                  <h3>February 2023</h3>
                  <span className="calendar-nav">›</span>
                </div>
                <div className="calendar-grid">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                    <div key={day} className="day-header">{day}</div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => {
                    const date = i + 1;
                    const isActive = date === 20;
                    return (
                      <button
                        key={date}
                        className={`date-cell ${isActive ? 'active' : ''}`}
                      >
                        {date}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="events-section">
                <h2>Upcoming Events</h2>
                <div className="events-list">
                  {eventsData.map((event) => (
                    <div key={event.id} className="event-item">
                      <div className="event-time">
                        <span className="event-day">{event.date}</span>
                        <span className="event-hour">{event.time}</span>
                      </div>
                      <div className="event-info">
                        <h4>{event.title}</h4>
                        <div
                          className="event-indicator"
                          style={{ backgroundColor: getEventColor(event.type) }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
