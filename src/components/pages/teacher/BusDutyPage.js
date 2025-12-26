import React, { useState, useEffect } from 'react';

function BusDutyPage() {
  const [busDutyData, setBusDutyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/teacher/bus-duty`)
      .then(res => res.json())
      .then(data => {
        setBusDutyData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch bus duty data", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="page-container">Loading Bus Duty Info...</div>;

  return (
    <div className="page-container">
      <h1>🚌 My Bus Duty</h1>
      <p className="page-intro">Details of your assigned bus and student roster.</p>
      
      {!busDutyData ? (
        <p>You are not currently assigned to any bus duty.</p>
      ) : (
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="dashboard-card">
            <h3>{busDutyData.busId}: {busDutyData.routeName}</h3>
            <h4>Student Roster</h4>
            <ul className="student-roster">
              {busDutyData.students.map((student, index) => (
                <li key={index}><span>{student}</span></li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusDutyPage;
