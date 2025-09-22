import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';
import './components/styles.css';

import ScrollToTop from './components/ScrollToTop';
import AnimatedPage from './components/AnimatedPage'; // 1. Import the animation wrapper
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import FeeCollection from './components/FeeCollection';
import AlumniPortal from './components/AlumniPortal';
import RegisterPage from './components/RegisterPage';
import SchoolRegister from './components/SchoolRegister';
import TeacherRegister from './components/TeacherRegister';
import StudentRegister from './components/StudentRegister';
import OtpVerification from './components/OtpVerification';
import Attendance from './components/Attendance';
import Grades from './components/Grades';
import Timetable from './components/Timetable';
import CampusTour from './components/CampusTour';
import UserProfile from './components/UserProfile';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import ContactPage from './components/ContactPage';

function App() {
  const location = useLocation(); // 2. Get the current page location

  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <main>
        {/* 3. Wrap Routes with AnimatePresence */}
        <AnimatePresence mode="wait">
          {/* 4. Add location and key props to Routes */}
          <Routes location={location} key={location.pathname}>
            {/* 5. Wrap every page component with AnimatedPage */}
            <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
            <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="/fees" element={<AnimatedPage><FeeCollection /></AnimatedPage>} />
            <Route path="/alumni" element={<AnimatedPage><AlumniPortal /></AnimatedPage>} />
            <Route path="/campus-tour" element={<AnimatedPage><CampusTour /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />

            <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
            <Route path="/register/school" element={<AnimatedPage><SchoolRegister /></AnimatedPage>} />
            <Route path="/register/teacher" element={<AnimatedPage><TeacherRegister /></AnimatedPage>} />
            <Route path="/register/student" element={<AnimatedPage><StudentRegister /></AnimatedPage>} />
            <Route path="/verify/:userType" element={<AnimatedPage><OtpVerification /></AnimatedPage>} />

            <Route path="/profile" element={<AnimatedPage><UserProfile /></AnimatedPage>} />
            <Route path="/attendance" element={<AnimatedPage><Attendance /></AnimatedPage>} />
            <Route path="/grades" element={<AnimatedPage><Grades /></AnimatedPage>} />
            <Route path="/timetable" element={<AnimatedPage><Timetable /></AnimatedPage>} />

            <Route path="/privacy-policy" element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
            <Route path="/terms-of-service" element={<AnimatedPage><TermsOfService /></AnimatedPage>} />
            <Route path="/cookie-policy" element={<AnimatedPage><CookiePolicy /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;

