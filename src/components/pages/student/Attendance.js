import React, { useState, useEffect } from 'react';

function Attendance() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/attendance`)
      .then(res => res.json())
      .then(data => {
        setAttendanceData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch attendance data", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !attendanceData) {
    return <div className="page-container">Loading attendance records...</div>;
  }
  
  const { summary, records } = attendanceData;

  return (
    <div className="page-container">
      <h1>📚 Attendance Record</h1>
      {/* ... summary grid ... */}
      <div className="dashboard-card recent-attendance-card">
        <h3>Recent Activity</h3>
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td data-label="Date">{record.date}</td>
                  <td data-label="Status">
                    <span className={`status ${record.status === 'Present' ? 'status-paid' : 'status-pending'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;

