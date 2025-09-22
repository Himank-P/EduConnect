import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

function ContactPage() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

 
    const SERVICE_ID = 'service_d74jx6q';
    const TEMPLATE_ID = 'template_xzj2wmg';
    const PUBLIC_KEY = 'tX4EokoXd3TVPXYJ3';
    // -----------------------------------------

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          alert('Thank you for your message! We will get back to you soon.');
          form.current.reset(); // Reset form fields
          setIsSubmitting(false);
      }, (error) => {
          console.log(error.text);
          alert('Sorry, something went wrong. Please try again later.');
          setIsSubmitting(false);
      });
  };

  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p className="page-intro">
        Have a question or want to learn more about our platform? We'd love to hear from you.
      </p>
      
      <div className="contact-layout">
        <div className="contact-form-container">
          <form ref={form} onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="user_name" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="user_email"
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject"
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="form-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
        <div className="contact-info-container">
          <div className="contact-info-block">
            <h3>Our Office</h3>
            <p>Tech Park One,<br/>Gurugram, Haryana 122001</p>
          </div>
           <div className="contact-info-block">
            <h3>Email Us</h3>
            <p><a href="mailto:support@educonnect.platform">support@educonnect.platform</a></p>
          </div>
           <div className="contact-info-block">
            <h3>Call Us</h3>
            <p><a href="tel:+911123456789">+91 11 2345 6789</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

