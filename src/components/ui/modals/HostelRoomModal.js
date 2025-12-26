import React, { useState, useEffect } from 'react';

function HostelRoomModal({ roomId, closeModal }) {
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoomData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/hostel/room/${roomId}`);
        if (!response.ok) throw new Error('Room data not found.');
        const data = await response.json();
        setRoomData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeModal}>×</button>
        
        {isLoading && <div className="loading-spinner" style={{margin: '40px auto'}}></div>}
        
        {!isLoading && roomData && (
          <>
            <div className="modal-header">
              {/* FIX 1: Use the roomId from props */}
              <h3>Room Details: {roomId}</h3>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h4>Occupants</h4>
                <ul className="occupants-list">
                  {roomData.occupants.map((name, index) => <li key={index}>{name}</li>)}
                </ul>
              </div>

              {/* FIX 2: This will now work because you added the data to the JSON */}
              <div className="modal-section">
                <h4>Resource Consumption</h4>
                <div className="detail-item">
                  <span>Electricity</span>
                  <strong>{roomData.consumption.electricity}</strong>
                </div>
                <div className="detail-item">
                  <span>Water</span>
                  <strong>{roomData.consumption.water}</strong>
                </div>
              </div>

              <div className="modal-section">
                <h4>Assets & Status</h4>
                <div className="detail-item">
                  <span>Assets</span>
                  <strong>{roomData.assets.join(', ')}</strong>
                </div>
                <div className="detail-item">
                  <span>Reported Issue</span>
                  <strong className={`status ${roomData.complaint === 'None' ? 'status-paid' : 'status-pending'}`}>
                    {roomData.complaint}
                  </strong>
                </div>
              </div>
            </div>
          </>
        )}

        {!isLoading && !roomData && <div className="modal-body"><p>Could not load room details.</p></div>}
      </div>
    </div>
  );
}

export default HostelRoomModal;