import React from 'react';
import { Link } from 'react-router-dom';

// **FIX:** The component now receives 'homeClass' as a prop
function HomeClassCard({ homeClass }) {
  
  // If for any reason the data is not available, show a loading/error state.
  if (!homeClass) {
    return (
      <div className="dashboard-card home-class-card">
        <h3>🏠 Home Class</h3>
        <p>Loading class details...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card home-class-card">
      <h3>🏠 Home Class</h3>
      <div className="home-class-details">
        <h4>{homeClass.className}</h4>
        <p className="home-class-subject">Primary Subject: {homeClass.subject}</p>
        <div className="home-class-stats">
          <div className="stat-item">
            <strong>{homeClass.totalStudents}</strong>
            <span>Students</span>
          </div>
          <div className="stat-item">
            <strong>{homeClass.classCaptain}</strong>
            <span>Class Captain</span>
          </div>
        </div>
        <p className="next-class-info">Next Class: {homeClass.nextClass}</p>
      </div>
       <Link to="/teacher/homeroom" className="card-link-button">Manage Homeroom</Link>
    </div>
  );
}

export default HomeClassCard;

