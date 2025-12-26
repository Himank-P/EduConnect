import React, { useState, useEffect } from 'react';

function DetailedAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/teacher/detailed-attendance`)
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

  if (isLoading) {
    return <div className="page-container">Loading detailed attendance...</div>;
  }

  return (
    <div className="page-container">
        <h1>📊 Detailed Attendance Records</h1>
        <p className="page-intro">An overview of attendance for all students in your assigned classes.</p>
        <div className="dashboard-card">
            <div className="table-container">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Attended</th>
                            <th>Total Classes</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map(student => (
                            <tr key={student.id}>
                                <td data-label="Student ID">{student.id}</td>
                                <td data-label="Name">{student.name}</td>
                                <td data-label="Class">{student.class}</td>
                                <td data-label="Attended">{student.attended}</td>
                                <td data-label="Total Classes">{student.total}</td>
                                <td data-label="Percentage"><strong>{student.percentage}</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

export default DetailedAttendance;
