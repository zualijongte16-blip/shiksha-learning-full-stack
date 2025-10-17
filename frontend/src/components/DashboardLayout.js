import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import DashboardCharts from './DashboardCharts';
import StudentQueries from './StudentQueries';
import TopEngagement from './TopEngagement';
import './DashboardLayout.css';

const DashboardLayout = ({
  // Sidebar props
  logo = "Lixco",
  logoIcon = "🏢",
  navigationItems = [],
  activeNavItem = "",
  onNavItemClick = () => {},
  username = "",
  onLogout = () => {},

  // Header props
  title = "Dashboard",
  userAvatar = "👤",
  onProfileClick = () => {},
  actionButtons = [],

  // Content props
  statsData = [],
  workingActivityData = [],
  revenueData = [],
  queriesData = [],
  engagementData = [],

  // Children content (for custom sections)
  children
}) => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <DashboardSidebar
        logo={logo}
        logoIcon={logoIcon}
        navigationItems={navigationItems}
        activeItem={activeNavItem}
        onItemClick={onNavItemClick}
        username={username}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <DashboardHeader
          title={title}
          username={username}
          userAvatar={userAvatar}
          onProfileClick={onProfileClick}
          actionButtons={actionButtons}
        />

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <StatsCards stats={statsData} />

          {/* Charts Section */}
          <DashboardCharts
            workingActivityData={workingActivityData}
            revenueData={revenueData}
          />

          {/* Bottom Section */}
          <div className="dashboard-bottom">
            <StudentQueries queries={queriesData} />
            <TopEngagement engagements={engagementData} />
          </div>

          {/* Custom Children Content */}
          {children && (
            <div className="dashboard-custom">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;