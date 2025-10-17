import React from 'react';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const teacherId = localStorage.getItem('teacherId');

  console.log('🎯 DASHBOARD COMPONENT LOADED');
  console.log('Role from localStorage:', role);
  console.log('Username from localStorage:', username);
  console.log('TeacherId from localStorage:', teacherId);
  console.log('All localStorage keys:', Object.keys(localStorage));
  console.log('All localStorage values:', Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])));

  // FORCE TEACHER DASHBOARD IF TEACHER ID EXISTS
  const effectiveRole = teacherId ? 'teacher' : role;
  console.log('Effective role (after teacherId check):', effectiveRole);

  // FORCE ALERT FOR DEBUGGING
  if (teacherId) {
    alert(`🔥 TEACHER DASHBOARD FORCED! Teacher ID: ${teacherId}, Effective Role: ${effectiveRole}`);
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  switch (effectiveRole) {
    case 'student':
      console.log('📚 Routing to StudentDashboard');
      return (
        <div>
          <div style={{
            background: 'linear-gradient(45deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            margin: '20px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            🎓 STUDENT DASHBOARD LOADED - You are logged in as a STUDENT
          </div>
          <StudentDashboard username={username} onLogout={handleLogout} />
        </div>
      );
    case 'teacher':
      console.log('👨‍🏫 Routing to TeacherDashboard');
      return (
        <div>
          <div style={{
            background: 'linear-gradient(45deg, #2196F3 0%, #1976D2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            margin: '20px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            👨‍🏫 ENHANCED TEACHER DASHBOARD LOADED - You are logged in as a TEACHER
            <br />
            <small>Check console for debug logs and look for the purple banner below!</small>
          </div>
          <TeacherDashboard username={username} onLogout={handleLogout} />
        </div>
      );
    case 'admin':
    case 'superadmin':
      console.log('👑 Routing to AdminDashboard');
      return (
        <div>
          <div style={{
            background: 'linear-gradient(45deg, #FF9800 0%, #F57C00 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            margin: '20px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            👑 ADMIN DASHBOARD LOADED - You are logged in as an ADMIN
          </div>
          <AdminDashboard username={username} onLogout={handleLogout} />
        </div>
      );
    default:
      console.log('❓ Default routing to StudentDashboard');
      return (
        <div>
          <div style={{
            background: 'linear-gradient(45deg, #9C27B0 0%, #7B1FA2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            margin: '20px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            ❓ DEFAULT DASHBOARD LOADED - Unknown role, defaulting to Student
          </div>
          <StudentDashboard username={username} onLogout={handleLogout} />
        </div>
      );
  }
};

export default Dashboard;