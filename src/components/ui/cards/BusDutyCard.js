import React from 'react';

function BusDutyCard({ busDuty, onClick }) {
  if (!busDuty) {
    return null; 
  }

  return (
    <div className="dashboard-card bus-duty-card" onClick={onClick}>
      <h3>🚌 Bus Duty Information</h3>
      <div className="bus-duty-details">
        <h4>{busDuty.busId} - {busDuty.model} ({busDuty.color})</h4>
        <p className="vehicle-number">{busDuty.vehicleNumber}</p>
        <div className="info-item">
          <span>Route:</span>
          <span className="info-meta">{busDuty.routeName}</span>
        </div>
        <div className="info-item">
          <span>Driver:</span>
          <span className="info-meta"><a href={`tel:${busDuty.driverPhone}`} className="text-link" onClick={(e) => e.stopPropagation()}>{busDuty.driverName}</a></span>
        </div>
         <div className="info-item">
          <span>Conductor:</span>
          <span className="info-meta"><a href={`tel:${busDuty.conductorPhone}`} className="text-link" onClick={(e) => e.stopPropagation()}>{busDuty.conductorName}</a></span>
        </div>
      </div>
      <div className="card-link-button view-roster-button">View Student Roster →</div>
    </div>
  );
}

export default BusDutyCard;

