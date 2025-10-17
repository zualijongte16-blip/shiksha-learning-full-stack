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
      return <StudentDashboard username={username} onLogout={handleLogout} />;
    case 'teacher':
      console.log('👨‍🏫 Routing to TeacherDashboard');
      return <TeacherDashboard username={username} onLogout={handleLogout} />;
    case 'admin':
    case 'superadmin':
      console.log('👑 Routing to AdminDashboard');
      return <AdminDashboard username={username} onLogout={handleLogout} />;
    default:
      console.log('📚 Default routing to StudentDashboard');
      return <StudentDashboard username={username} onLogout={handleLogout} />;
  }
};

export default Dashboard;