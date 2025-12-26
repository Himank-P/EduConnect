import React from 'react';

function PlatformOverview() {
  return (
    <section className="platform-overview">
      <div className="container">
        <h2 className="section-title">A Unified Digital Campus</h2>
        <p className="section-subtitle">
          EduConnect integrates all your essential functions into one central hub, powered by the cloud tools you already trust.
        </p>
        <div className="overview-diagram">
          <div className="overview-core">
            <div className="core-icon">🔄</div>
            <strong>Single Source of Truth</strong>
            <span>(Your Cloud Suite)</span>
          </div>
          <div className="overview-module admissions">
            <span>Admissions</span>
          </div>
          <div className="overview-module fees">
            <span>Fee Collection</span>
          </div>
          <div className="overview-module records">
            <span>Student Records</span>
          </div>
          <div className="overview-module dashboards">
            <span>Dashboards</span>
          </div>
          <div className="overview-module communication">
            <span>Communication</span>
          </div>
          <div className="overview-module library">
            <span>Library & Hostels</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlatformOverview;
