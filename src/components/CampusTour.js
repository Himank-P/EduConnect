import React from 'react';
import { Link } from 'react-router-dom';

function CampusTour() {
  return (
    <div className="tour-container">
      <iframe 
        className="tour-iframe"
        src="https://www.google.com/maps/embed?pb=!1m0!4v1663920942583!6m8!1m7!1sCAoSLEFGMVFpcE5qV2VUT0JzWDRxMm1uS0N0dU5zTlNualZCMTQtX1I0S2l0XzF3!2m2!1d28.5454655!2d77.1923204!3f31.78!4f-1.55!5f0.7820865974627469" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }}
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Interactive Campus Tour"
      ></iframe>
      
      <div className="tour-ui">
          <Link to="/" className="tour-back-button">← Back to Home</Link>
          <div className="tour-title">
              <h1>Campus Virtual Tour</h1>
              <p>Click and drag to look around the campus.</p>
          </div>
      </div>
    </div>
  );
}

export default CampusTour;

