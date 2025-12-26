import React, { useState, useEffect } from 'react';
import TestimonialCard from '../cards/TestimonialCard';

function Testimonials() {
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => {
        setTestimonialsData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch testimonials", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">Trusted by Leading Institutions</h2>
        
        {isLoading ? (
          <p>Loading testimonials...</p>
        ) : (
          <div className="testimonial-grid">
            {testimonialsData.map(testimonial => (
              <TestimonialCard 
                key={testimonial.id}
                quote={testimonial.quote}
                authorName={testimonial.authorName}
                authorTitle={testimonial.authorTitle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;

