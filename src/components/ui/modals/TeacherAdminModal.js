import React, { useState, useEffect } from 'react';

function TeacherAdminModal({ teacherId, closeModal }) {
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!teacherId) return;
    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/teacher-details/${teacherId}`);
            if (!response.ok) throw new Error("Teacher details not found.");
            const data = await response.json();
            setTeacherData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    fetchDetails();
  }, [teacherId]);

  return (
    <div className="modal-overlay" onClick={closeModal}>
       <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeModal}>×</button>
        {isLoading && <div className="loading-spinner"></div>}
        {!isLoading && teacherData && (
            <>
                <div className="modal-header">
                <h3>{teacherData.name}</h3>
                <p>{teacherData.id} | {teacherData.department}</p>
                </div>
                <div className="modal-body">
                <div className="modal-section">
                    <h4>Details</h4>
                    <div className="detail-item"><span>Salary Status</span><strong className={`status ${teacherData.salaryStatus === 'Paid' ? 'status-paid' : 'status-pending'}`}>{teacherData.salaryStatus}</strong></div>
                    <div className="detail-item"><span>Bus Service</span><strong>{teacherData.busService}</strong></div>
                    <div className="detail-item"><span>Homeroom</span><strong>{teacherData.homeroom}</strong></div>
                </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}

export default TeacherAdminModal;

