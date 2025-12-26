import React, { useState, useEffect } from 'react';

function TransportCard() {
  const [transportData, setTransportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/student/transport`)
      .then(res => res.json())
      .then(data => {
        setTransportData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch transport data", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="dashboard-card transport-card"><p>Loading transport details...</p></div>;
  }

  if (!transportData) {
      return (
          <div className="dashboard-card transport-card">
              <h3>🚌 Transport Details</h3>
              <p>No transport service availed.</p>
          </div>
      );
  }

  return (
    <div className="dashboard-card transport-card">
      <div className="transport-card-grid">
        <div className="transport-details">
            <h3>{transportData.busId} - {transportData.model} ({transportData.color})</h3>
            <p className="vehicle-number">{transportData.vehicleNumber}</p>
            <div className="info-item">
                <span>Route:</span>
                <span className="info-meta">{transportData.routeName}</span>
            </div>
            <div className="info-item">
                <span>Driver:</span>
                <span className="info-meta"><a href={`tel:${transportData.driverPhone}`} className="text-link">{transportData.driverName}</a></span>
            </div>
            <div className="info-item">
                <span>Conductor:</span>
                <span className="info-meta"><a href={`tel:${transportData.conductorPhone}`} className="text-link">{transportData.conductorName}</a></span>
            </div>
             <div className="info-item">
                <span>Faculty-in-Charge:</span>
                <span className="info-meta"><a href={`tel:${transportData.facultyPhone}`} className="text-link">{transportData.femaleFaculty}</a></span>
            </div>
        </div>
        <div className="transport-map">
             <iframe 
                src={transportData.googleMapsEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bus Route Map"
            ></iframe>
        </div>
      </div>
    </div>
  );
}

export default TransportCard;

