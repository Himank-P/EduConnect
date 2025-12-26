import React, { useMemo } from 'react';

// This component receives the raw JSON from the AI and renders it
function TimetableDisplay({ timetableData }) {
  // **THE FIX:** The useMemo hook is now at the top level of the component,
  // before any conditional returns. This follows the Rules of Hooks.
  const teacherTimetables = useMemo(() => {
    // We check if timetableData is valid inside the hook itself.
    if (!timetableData) return {};
    const schedules = {};

    for (const className in timetableData) {
      const classSchedule = timetableData[className];
      for (const day in classSchedule) {
        const periods = classSchedule[day];
        periods.forEach(period => {
          const { teacher, subject, time } = period;
          if (teacher && teacher !== 'Break') {
            if (!schedules[teacher]) {
              schedules[teacher] = { Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {} };
            }
            schedules[teacher][day][time] = { className, subject };
          }
        });
      }
    }
    return schedules;
  }, [timetableData]);

  // This guard clause remains to prevent rendering if the data is not yet available.
  if (!timetableData || Object.keys(timetableData).length === 0) {
    return <p style={{textAlign: 'center', marginTop: '20px'}}>Timetable data is being processed or is not yet available.</p>;
  }

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="timetable-display-area">
      <div className="admin-section">
        <h2>Generated Class Timetables</h2>
        {Object.entries(timetableData).map(([className, schedule]) => (
          <div key={className} className="timetable-wrapper">
            <h3>{className}</h3>
            <div className="table-container">
              <table className="history-table timetable">
                <thead>
                  <tr>
                    <th>Time</th>
                    {days.map(day => <th key={day}>{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => (
                    <tr key={time}>
                      <td>{time}</td>
                      {days.map(day => {
                        const period = schedule[day]?.find(p => p.time === time);
                        return (
                          <td key={day} className={period?.subject === 'Break' ? 'break-slot' : ''}>
                            {period ? (
                              <>
                                <div className="timetable-subject">{period.subject}</div>
                                <div className="timetable-teacher">{period.teacher}</div>
                              </>
                            ) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <h2>Generated Teacher Timetables</h2>
        {Object.entries(teacherTimetables).map(([teacherName, schedule]) => (
          <div key={teacherName} className="timetable-wrapper">
            <h3>{teacherName}</h3>
            <div className="table-container">
              <table className="history-table timetable">
                <thead>
                  <tr>
                    <th>Time</th>
                    {days.map(day => <th key={day}>{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => (
                    <tr key={time}>
                      <td>{time}</td>
                      {days.map(day => {
                        const period = schedule[day]?.[time];
                        return (
                          <td key={day}>
                            {period ? (
                              <>
                                <div className="timetable-subject">{period.subject}</div>
                                <div className="timetable-teacher">{period.className}</div>
                              </>
                            ) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimetableDisplay;

