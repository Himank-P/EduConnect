import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HostelCard() {
  const [hostelData, setHostelData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/student/hostel`)
      .then(res => res.json())
      .then(data => setHostelData(data))
      .catch(err => console.error("Failed to fetch hostel data", err));
  }, []);

  if (!hostelData) {
    return <div className="dashboard-card hostel-card"><h3>🛏️ Hostel Information</h3><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-card hostel-card">
      <h3>🛏️ Hostel Information</h3>
      <div className="info-item">
        <span>Allotted Room:</span>
        <span className="info-meta bold">{hostelData.allottedRoom || 'Not Allotted'}</span>
      </div>
       <div className="info-item">
        <span>Status:</span>
        <span className={`status ${hostelData.status === 'Confirmed' ? 'status-paid' : 'status-pending'}`}>{hostelData.status || 'N/A'}</span>
      </div>
      <Link to="/hostel-services" className="card-link-button">Hostel Services →</Link>
    </div>
  );
}

export default HostelCard;

