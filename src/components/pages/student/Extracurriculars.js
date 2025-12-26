import React, { useState, useEffect } from 'react';

function Extracurriculars() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/extracurriculars`)
      .then(res => res.json())
      .then(data => {
        setActivities(data.activities);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch extracurriculars", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="page-container">Loading activities...</div>;
  }

  return (
    <div className="page-container">
      <h1>🎨 Extracurricular Activities</h1>
      <p className="page-intro">
        A detailed record of your involvement in clubs, societies, events, and sports.
      </p>
      <div className="activities-list">
        {activities.map((activity, index) => (
          <div className="activity-card" key={index}>
            <div className={`activity-type ${activity.type.toLowerCase()}`}>{activity.type}</div>
            <div className="activity-details">
              <h4>{activity.name}</h4>
              <p><strong>Role:</strong> {activity.role}</p>
              <p><strong>Duration:</strong> {activity.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Extracurriculars;

