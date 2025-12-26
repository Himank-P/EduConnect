import React, { useState, useEffect } from 'react';

function RouteMapModal({ routeName, closeModal }) {
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!routeName) return;

    const fetchRouteData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/transport/route/${encodeURIComponent(routeName)}`);
        if (!response.ok) throw new Error('Route data not found.');
        const data = await response.json();
        setRouteData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRouteData();
  }, [routeName]);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeModal}>×</button>
        <div className="modal-header">
          <h3>Route Map: {routeName}</h3>
        </div>
        <div className="modal-body map-modal-body">
          {isLoading && <div className="loading-spinner"></div>}
          {!isLoading && routeData && (
            <iframe
              src={routeData.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map for ${routeName}`}
            ></iframe>
          )}
           {!isLoading && !routeData && <p>Could not load map data for this route.</p>}
        </div>
      </div>
    </div>
  );
}

export default RouteMapModal;
