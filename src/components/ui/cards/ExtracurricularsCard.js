import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ExtracurricularsCard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/extracurriculars`)
      .then(res => res.json())
      .then(data => setSummary(data.summary))
      .catch(err => console.error("Failed to fetch extracurriculars summary", err));
  }, []);

  if (!summary) {
    return <div className="dashboard-card extracurricular-card"><p>Loading...</p></div>;
  }

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

