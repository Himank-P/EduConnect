import React, { useState, useEffect } from 'react';
import AlumniCard from '../../ui/cards/AlumniCard';

function AlumniPortal() {
  const [alumniData, setAlumniData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/alumni`);
        if (!response.ok) {
          throw new Error('Failed to fetch alumni data.');
        }
        const data = await response.json();
        setAlumniData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumniData();
  }, []); 

  return (
    <div className="page-container">
      <h1>🌐 Alumni Portal</h1>
      <p className="page-intro">Connect with fellow alumni, find mentorship opportunities, and stay updated with campus news.</p>
      
      {isLoading && <p>Loading alumni profiles...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      {!isLoading && !error && (
        <div className="alumni-grid">
          {alumniData.map(alumnus => (
            <AlumniCard key={alumnus.id} alumni={alumnus} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AlumniPortal;

