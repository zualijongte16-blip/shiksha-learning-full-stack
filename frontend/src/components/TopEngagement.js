import React from 'react';
import './TopEngagement.css';

const TopEngagement = ({ 
  title = "Top Engagement",
  engagements = [
    { country: "Bangladesh", percentage: "20%", color: "blue" },
    { country: "Switzerland", percentage: "30%", color: "green" },
    { country: "Canada", percentage: "45%", color: "orange" },
    { country: "Netherland", percentage: "10%", color: "purple" }
  ]
}) => {
  return (
    <div className="top-engagement">
      <div className="engagement-header">
        <h3>{title}</h3>
        <button className="more-options">⋮</button>
      </div>

      <div className="engagement-content">
        {/* World Map Placeholder */}
        <div className="world-map">
          <div className="map-placeholder">
            {/* Simple world map representation */}
            <div className="continent america">
              <div className="country usa" title="USA"></div>
              <div className="country canada" title="Canada"></div>
            </div>
            <div className="continent europe">
              <div className="country uk" title="UK"></div>
              <div className="country germany" title="Germany"></div>
              <div className="country france" title="France"></div>
            </div>
            <div className="continent asia">
              <div className="country china" title="China"></div>
              <div className="country india" title="India"></div>
              <div className="country bangladesh" title="Bangladesh"></div>
            </div>
            <div className="continent africa">
              <div className="country south-africa" title="South Africa"></div>
            </div>
            <div className="continent australia">
              <div className="country australia" title="Australia"></div>
            </div>

            {/* Engagement indicators */}
            <div className="engagement-indicator bangladesh-indicator" style={{ backgroundColor: '#3b82f6' }}>
              <span className="indicator-dot"></span>
            </div>
            <div className="engagement-indicator switzerland-indicator" style={{ backgroundColor: '#10b981' }}>
              <span className="indicator-dot"></span>
            </div>
            <div className="engagement-indicator canada-indicator" style={{ backgroundColor: '#f59e0b' }}>
              <span className="indicator-dot"></span>
            </div>
            <div className="engagement-indicator netherland-indicator" style={{ backgroundColor: '#8b5cf6' }}>
              <span className="indicator-dot"></span>
            </div>
          </div>
        </div>

        {/* Engagement List */}
        <div className="engagement-list">
          {engagements.map((engagement, index) => (
            <div key={index} className="engagement-item">
              <div className="engagement-indicator">
                <div 
                  className="indicator-dot" 
                  style={{ backgroundColor: 
                    engagement.color === 'blue' ? '#3b82f6' :
                    engagement.color === 'green' ? '#10b981' :
                    engagement.color === 'orange' ? '#f59e0b' :
                    engagement.color === 'purple' ? '#8b5cf6' : '#6b7280'
                  }}
                ></div>
              </div>
              <div className="engagement-details">
                <div className="engagement-country">{engagement.country}</div>
                <div className="engagement-percentage">{engagement.percentage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopEngagement;