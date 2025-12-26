import React, { useState, useEffect } from 'react';

function Timetable() {
  const [timetableData, setTimetableData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/timetable`)
      .then(res => res.json())
      .then(data => {
        setTimetableData(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !timetableData) {
    return <div className="page-container">Loading timetable...</div>;
  }

  const { schedule, timeSlots } = timetableData;

  return (
    <div className="page-container">
      <h1>🗓️ Class Timetable</h1>
      <p className="page-intro">
        Your weekly schedule for classes, labs, and breaks.
      </p>
      <div className="dashboard-card timetable-card">
        <div className="table-container">
          <table className="history-table timetable">
            <thead>
              <tr>
                <th>Time</th>
                {Object.keys(schedule).map(day => <th key={day}>{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, timeIndex) => (
                <tr key={time}>
                  <td>{time}</td>
                  {Object.keys(schedule).map(day => (
                    <td key={day} className={schedule[day][timeIndex].subject === 'Break' ? 'break-slot' : ''}>
                      <div className="timetable-subject">{schedule[day][timeIndex].subject}</div>
                      <div className="timetable-teacher">{schedule[day][timeIndex].teacher}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Timetable;
