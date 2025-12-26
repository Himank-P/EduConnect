import React, { useState, useEffect } from 'react';

const RoleSpecificDetails = ({ role, details }) => {
    if (!details) return null;

    switch (role) {
        case 'Cleaner':
            return <div className="detail-item"><span>Assigned Area</span><strong>{details.assignedArea}</strong></div>;
        case 'Peon':
            return <div className="detail-item"><span>Assigned Dept.</span><strong>{details.assignedDept}</strong></div>;
        case 'Guard':
            return <div className="detail-item"><span>Post Location</span><strong>{details.postLocation}</strong></div>;
        case 'Receptionist':
            return <div className="detail-item"><span>Contact Ext.</span><strong>{details.contactExt}</strong></div>;
        case 'Driver':
        case 'Conductor':
            return <div className="detail-item"><span>Assigned Bus</span><strong>{details.assignedBus}</strong></div>;
        case 'Lab Assistant':
            return <div className="detail-item"><span>Assigned Lab</span><strong>{details.assignedLab}</strong></div>;
        case 'Admin Office':
            return <div className="detail-item"><span>Title</span><strong>{details.title}</strong></div>;
        default:
            return null;
    }
};

function StaffAdminModal({ staffId, closeModal }) {
  const [staffData, setStaffData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!staffId) return;
    
    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/staff-details/${staffId}`);
            if (!response.ok) throw new Error("Staff details not found.");
            const data = await response.json();
            setStaffData(data);
        } catch(err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    fetchDetails();
  }, [staffId]);

  return (
    <div className="modal-overlay" onClick={closeModal}>
       <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeModal}>×</button>
        {isLoading && <div className="loading-spinner" style={{margin: '40px auto'}}></div>}
        
        {!isLoading && staffData && (
            <>
                <div className="modal-header">
                  <h3>{staffData.name}</h3>
                  <p>{staffData.id} | {staffData.role}</p>
                </div>
                <div className="modal-body">
                  <div className="modal-section">
                    <h4>Details</h4>
                    <div className="detail-item">
                        <span>Shift</span>
                        <strong>{staffData.shift}</strong>
                    </div>
                    <RoleSpecificDetails role={staffData.role} details={staffData.details} />
                  </div>
                </div>
            </>
        )}
        
        {!isLoading && !staffData && (
            <div className="modal-body">
                <p style={{textAlign: 'center'}}>Could not load staff details.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default StaffAdminModal;
