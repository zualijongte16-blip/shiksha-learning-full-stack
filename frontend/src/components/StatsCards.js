import React from 'react';
import './StatsCards.css';

const StatsCards = ({ 
  stats = [
    { label: "Total Students", value: "40K", icon: "👥", color: "blue" },
    { label: "Courses", value: "45", icon: "📚", color: "green" },
    { label: "Total Videos", value: "120", icon: "📹", color: "purple" },
    { label: "Total Earning", value: "$32000", icon: "💰", color: "orange" }
  ] 
}) => {
  return (
    <div className="stats-cards">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color}`}>
          <div className="stat-icon">
            {stat.icon}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
          <div className="stat-trend">
            <span className="trend-indicator">↗</span>
            <span className="trend-value">+12%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;