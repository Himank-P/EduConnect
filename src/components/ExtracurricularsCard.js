import React from 'react';
import { Link } from 'react-router-dom';

function ExtracurricularsCard() {
  // Sample data
  const summary = {
    clubs: 3,
    events: 5,
    latestAchievement: '1st Place, Inter-School Hackathon'
  };

  return (
    <div className="dashboard-card extracurricular-card">
      <h3>🎨 Extracurriculars</h3>
      <div className="info-item">
        <span>Clubs Joined:</span>
        <span className="info-meta bold">{summary.clubs}</span>
      </div>
      <div className="info-item">
        <span>Events Participated:</span>
        <span className="info-meta bold">{summary.events}</span>
      </div>
       <div className="info-item">
        <span>Latest Achievement:</span>
        <span className="info-meta">{summary.latestAchievement}</span>
      </div>
      <Link to="/extracurriculars" className="card-link-button">View All Activities</Link>
    </div>
  );
}

export default ExtracurricularsCard;
