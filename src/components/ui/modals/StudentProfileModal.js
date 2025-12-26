import React, { useState, useEffect } from 'react';

function StudentProfileModal({ studentId, closeModal }) {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/teacher/student-details/${studentId}`);
        if (!response.ok) throw new Error("Student details not found.");
        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error("Failed to fetch student details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [studentId]);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeModal}>×</button>
        
        {isLoading && <div className="loading-spinner" style={{margin: '40px auto'}}></div>}
        
        {!isLoading && studentData && (
          <>
            <div className="modal-header">
              <h3>{studentData.name}</h3>
              <p>{studentData.id} | {studentData.class}</p>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h4>Academic Snapshot</h4>
                <div className="detail-item">
                    <span>Overall Attendance</span>
                    <strong>{studentData.attendance}</strong>
                </div>
                {studentData.marks.map(mark => (
                  <div className="detail-item" key={mark.subject}>
                    <span>{mark.subject}</span>
                    <strong>{mark.score}</strong>
                  </div>
                ))}
              </div>
              
              {/* --- NEW Transport Details Section --- */}
              {studentData.transport && (
                <div className="modal-section">
                    <h4>Transport Details</h4>
                    <div className="detail-item">
                        <span>Bus Number</span>
                        <strong>{studentData.transport.busId}</strong>
                    </div>
                    <div className="detail-item">
                        <span>Route</span>
                        <strong>{studentData.transport.routeName}</strong>
                    </div>
                     <div className="detail-item">
                        <span>Faculty-in-Charge</span>
                        <strong>{studentData.transport.femaleFaculty}</strong>
                    </div>
                </div>
              )}

              <div className="modal-section">
                <h4>Recent Attendance</h4>
                {studentData.recentAttendance.map(att => (
                  <div className="detail-item" key={att.date}>
                    <span>{att.date}</span>
                    <span className={`status ${att.status === 'Present' ? 'status-paid' : 'status-absent'}`}>{att.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {!isLoading && !studentData && (
            <div className="modal-body">
                <p style={{textAlign: 'center'}}>Could not load student details.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfileModal;

