import React from 'react';

function BusRosterModal({ bus, closeModal }) {
  if (!bus) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeModal}>×</button>
        <div className="modal-header">
          <h3>Student Roster: {bus.id}</h3>
          <p>{bus.route}</p>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h4>Assigned Students</h4>
            <ul className="occupants-list">
              {bus.students && bus.students.length > 0 ? (
                bus.students.map((student, index) => <li key={index}>{student}</li>)
              ) : (
                <li>No students assigned to this bus.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusRosterModal;
