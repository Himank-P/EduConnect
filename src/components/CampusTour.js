import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Data for the interactive hotspots
const hotspots = [
    { id: 1, top: '45%', left: '20%', name: 'Academic Block A', info: 'Houses the science and engineering departments.' },
    { id: 2, top: '50%', left: '50%', name: 'Central Plaza', info: 'A common area for students to gather and relax.' },
    { id: 3, top: '48%', left: '80%', name: 'Main Library', info: 'Contains over 50,000 volumes and digital resources.' },
];

function CampusTour() {
    const [activeHotspot, setActiveHotspot] = useState(null);
    const containerRef = useRef(null);

    // This effect handles the panoramic panning based on mouse movement
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = container;

            // Calculate mouse position from center (-1 to 1 range)
            const x = (clientX / offsetWidth - 0.5) * 2; 
            
            // Apply a transform to the background image
            const image = container.querySelector('.tour-panorama-image');
            if(image) {
                // The '10' controls the sensitivity of the panning
                image.style.transform = `translateX(${-x * 10}%) scale(1.2)`;
            }
        };
        
        container.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="tour-container" ref={containerRef}>
            {/* UPDATED IMAGE URL to a real campus photo */}
            <div className="tour-panorama-image" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop)` }}></div>
            
            <div className="tour-overlay"></div>
            
            <div className="tour-ui">
                <Link to="/" className="tour-back-button">← Back to Home</Link>
                <div className="tour-title">
                    <h1>Campus Virtual Tour</h1>
                    <p>Pan with your mouse to look around and click the markers for more info.</p>
                </div>
            </div>

            {hotspots.map(spot => (
                <div 
                    key={spot.id}
                    className="tour-hotspot" 
                    style={{ top: spot.top, left: spot.left }}
                    onClick={() => setActiveHotspot(spot.id === activeHotspot ? null : spot)}
                >
                    +
                    {activeHotspot && activeHotspot.id === spot.id && (
                        <div className="tour-info-box">
                            <strong>{spot.name}</strong>
                            <p>{spot.info}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default CampusTour;

