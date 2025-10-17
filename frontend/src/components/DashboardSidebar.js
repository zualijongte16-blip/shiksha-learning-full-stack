import React from 'react';
import './DashboardSidebar.css';

const DashboardSidebar = ({
  logo = "Shiksha",
  logoIcon = "🎓",
  logoImage = "/images/shikhsa_logo.png",
  navigationItems = [],
  activeItem = "",
  onItemClick = () => {},
  username = "",
  onLogout = () => {}
}) => {
  return (
    <aside className="dashboard-sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img
          src={logoImage}
          alt="Shiksha Logo"
          className="logo-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="logo-icon" style={{ display: 'none' }}>
          {logoIcon}
        </div>
        <div className="logo-text">{logo}</div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {navigationItems.map((item, index) => (
          <button
            key={index}
            className={`nav-item ${activeItem === item.key ? 'active' : ''}`}
            onClick={() => onItemClick(item.key)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <div className="user-name">{username}</div>
            <div className="user-role">Dashboard User</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;