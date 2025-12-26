import React from 'react';

// This is a reusable card component for testimonials
function TestimonialCard({ quote, authorName, authorTitle }) {
  return (
    <div className="testimonial-card">
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-author">
        <span className="author-name">- {authorName}</span>
        <span className="author-title">{authorTitle}</span>
      </div>
    </div>
  );
}

export default TestimonialCard;
