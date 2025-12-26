import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link

function CampusLifeCard() {
  const [campusLifeData, setCampusLifeData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/campus-life`)
      .then(res => res.json())
      .then(data => setCampusLifeData(data))
      .catch(err => console.error("Failed to fetch campus life data", err));
  }, []);

  return (
    <div className="dashboard-card campus-life-card">
      <h3>🎉 Campus Life & Events</h3>
      <ul className="campus-life-list">
        {campusLifeData.length > 0 ? (
          campusLifeData.slice(0, 3).map(item => ( // Show only the first 3 items on the dashboard
            <li key={item.id}>
              <span className={`item-tag ${item.type.toLowerCase()}`}>{item.type}</span>
              <a href="#!">{item.title}</a>
            </li>
          ))
        ) : (
          <p>Loading updates...</p>
        )}
      </ul>
       {/* 2. Update the link to navigate to the new page */}
       <Link to="/campus-life" className="card-link-button view-all">View All Updates →</Link>
    </div>
  );
}

export default CampusLifeCard;

