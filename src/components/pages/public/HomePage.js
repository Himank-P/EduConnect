import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';import Hero from '../../ui/homepage/Hero';
import WhyEduConnect from '../../ui/homepage/WhyEduConnect';
import PlatformOverview from '../../ui/homepage/PlatformOverview';
import Features from '../../ui/homepage/Features';
import Testimonials from '../../ui/homepage/Testimonials';
import CtaSection from '../../ui/homepage/CtaSection';

function HomePage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Hero />
      <WhyEduConnect />
      <PlatformOverview />
      <Features />
      <Testimonials />
      <CtaSection />
    </>
  );
}

export default HomePage;

