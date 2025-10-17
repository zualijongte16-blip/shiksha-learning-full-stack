import React from 'react';
import './DashboardHeader.css';

const DashboardHeader = ({ 
  title = "Dashboard", 
  username = "", 
  userAvatar = "👤",
  onProfileClick = () => {},
  actionButtons = []
}) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="dashboard-title">{title}</h1>
        <p className="dashboard-subtitle">Welcome back, {username}!</p>
      </div>

      <div className="header-right">
        {/* Action Buttons */}
        <div className="header-actions">
          {actionButtons.map((button, index) => (
            <button
              key={index}
              className={`action-btn ${button.variant || 'primary'}`}
              onClick={button.onClick}
              title={button.tooltip}
            >
              <span className="action-icon">{button.icon}</span>
              {button.label && <span className="action-label">{button.label}</span>}
            </button>
          ))}
        </div>

        {/* User Profile */}
        <div className="user-profile" onClick={onProfileClick}>
          <div className="user-avatar">
            {userAvatar}
          </div>
          <div className="user-info">
            <div className="user-name">{username}</div>
            <div className="user-role">Dashboard User</div>
          </div>
          <div className="dropdown-icon">▼</div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;