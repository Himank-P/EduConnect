import React, { useState, useEffect } from 'react';

function StudentAdminModal({ studentId, closeModal }) {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/student-details/${studentId}`);
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
        {isLoading && <div className="loading-spinner"></div>}
        {!isLoading && studentData && (
          <>
            <div className="modal-header">
              <h3>{studentData.name}</h3>
              <p>{studentData.id} | {studentData.class}</p>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h4>Service Status</h4>
                <div className="detail-item"><span>Fee Status</span><strong className={`status ${studentData.feeStatus === 'Paid' ? 'status-paid' : 'status-pending'}`}>{studentData.feeStatus}</strong></div>
                <div className="detail-item"><span>Bus Service</span><strong>{studentData.busService}</strong></div>
                <div className="detail-item"><span>Hostel Service</span><strong>{studentData.hostelService}</strong></div>
                <div className="detail-item"><span>Books Issued</span><strong>{studentData.booksIssued}</strong></div>
              </div>
            </div>
          </>
        )}
        {!isLoading && !studentData && (
            <div className="modal-body"><p>Could not load details.</p></div>
        )}
      </div>
    </div>
  );
}

export default StudentAdminModal;

