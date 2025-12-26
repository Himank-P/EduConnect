import React, { useState, useEffect } from 'react';
import StudentProfileModal from '../../ui/modals/StudentProfileModal';

function Homeroom() {
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/api/teacher/homeroom`).then(res => res.json()),
      fetch(`${process.env.REACT_APP_API_URL}/api/teacher/homeroom-timetable`).then(res => res.json())
    ]).then(([studentData, timetableData]) => {
      setStudents(studentData);
      setTimetable(timetableData);
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to fetch homeroom data", err);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div className="page-container">Loading...</div>;

  return (
    <>
      <div className="page-container">
          <h1>🏠 Homeroom Students</h1>
          <p className="page-intro">An overview of your primary homeroom class.</p>
          
          {timetable && (
            <div className="admin-section">
                <h2>Class Timetable</h2>
                <div className="dashboard-card">
                    <div className="table-container">
                        <table className="history-table timetable">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    {Object.keys(timetable.schedule).map(day => <th key={day}>{day}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {timetable.timeSlots.map((time, timeIndex) => (
                                    <tr key={time}>
                                        <td>{time}</td>
                                        {Object.keys(timetable.schedule).map(day => (
                                            <td key={day}>
                                                {timetable.schedule[day][timeIndex] ? (
                                                    <>
                                                        <div className="timetable-subject">{timetable.schedule[day][timeIndex].subject}</div>
                                                        <div className="timetable-teacher">{timetable.schedule[day][timeIndex].teacher}</div>
                                                    </>
                                                ) : '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          )}

          <div className="admin-section">
            <h2>Student Roster</h2>
            <div className="dashboard-card">
                <div className="table-container">
                    <table className="history-table student-list-table">
                       <thead>
                          <tr>
                              <th>Student ID</th>
                              <th>Name</th>
                              <th>Class</th>
                              <th>Attendance</th>
                              <th>Last Recorded Mark</th>
                          </tr>
                      </thead>
                      <tbody>
                          {students.map(student => (
                              <tr key={student.id} onClick={() => setSelectedStudent(student.id)}>
                                  <td>{student.id}</td>
                                  <td>{student.name}</td>
                                  <td>{student.class}</td>
                                  <td>{student.attendance}</td>
                                  <td>{student.lastMark}</td>
                              </tr>
                          ))}
                      </tbody>
                    </table>
                </div>
            </div>
          </div>
      </div>
      {selectedStudent && <StudentProfileModal studentId={selectedStudent} closeModal={() => setSelectedStudent(null)} />}
    </>
  );
}

export default Homeroom;

