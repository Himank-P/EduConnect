import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout & Utils
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import AnimatedPage from './components/layout/AnimatedPage';
import Dashboard from './dashboards/Dashboard';
import MessagingPage from './components/pages/shared/MessagingPage';
import Chatbot from './components/layout/Chatbot'; 

// Public Pages
import HomePage from './components/pages/public/HomePage';
import ContactPage from './components/pages/public/ContactPage';

// Auth Pages
import LoginPage from './components/pages/auth/LoginPage';
import RegisterPage from './components/pages/auth/RegisterPage';
import SchoolRegister from './components/pages/auth/SchoolRegister';
import TeacherRegister from './components/pages/auth/TeacherRegister';
import StudentRegister from './components/pages/auth/StudentRegister';
import OtpVerification from './components/pages/auth/OtpVerification';
import SchoolOnboarding from './components/pages/auth/SchoolOnboarding';
import TeacherOnboarding from './components/pages/auth/TeacherOnboarding';
import StudentOnboarding from './components/pages/auth/StudentOnboarding';

// Student Pages
import AlumniPortal from './components/pages/student/AlumniPortal';
import CampusTour from './components/pages/student/CampusTour';
import FutureGuidance from './components/pages/student/FutureGuidance';
import Extracurriculars from './components/pages/student/Extracurriculars';
import UserProfile from './components/pages/student/UserProfile';
import Attendance from './components/pages/student/Attendance';
import Grades from './components/pages/student/Grades';
import FeeCollection from './components/pages/student/FeeCollection';
import LibraryCatalogPage from './components/pages/student/LibraryCatalogPage';
import CampusLifePage from './components/pages/student/CampusLifePage';
import Timetable from './components/pages/student/Timetable';
import HostelServices from './components/pages/student/HostelServices';

// Teacher Pages
import TeacherProfile from './components/pages/teacher/TeacherProfile';
import MyClasses from './components/pages/teacher/MyClasses';
import UploadMarks from './components/pages/teacher/UploadMarks';
import UploadAttendance from './components/pages/teacher/UploadAttendance';
import DetailedAttendance from './components/pages/teacher/DetailedAttendance';
import Homeroom from './components/pages/teacher/Homeroom';
import BusDutyPage from './components/pages/teacher/BusDutyPage';

// Admin Pages
import TransportAdmin from './components/pages/admin/TransportAdmin';
import HostelAdmin from './components/pages/admin/HostelAdmin';
import LibraryAdmin from './components/pages/admin/LibraryAdmin';
import LibraryBooks from './components/pages/admin/LibraryBooks';
import StudentsAdmin from './components/pages/admin/StudentsAdmin';
import TeachersAdmin from './components/pages/admin/TeachersAdmin';
import StaffAdmin from './components/pages/admin/StaffAdmin';
import FinancesAdmin from './components/pages/admin/FinancesAdmin';
import PlacementsAdmin from './components/pages/admin/PlacementsAdmin';
import TimetableGenerator from './components/pages/admin/TimetableGenerator';
import ComplaintsLog from './components/pages/admin/ComplaintsLog';
import LabInventory from './components/pages/admin/LabInventory';
import DataTransfer from './components/pages/admin/DataTransfer';

// Legal Pages
import PrivacyPolicy from './components/pages/legal/PrivacyPolicy';
import TermsOfService from './components/pages/legal/TermsOfService';
import CookiePolicy from './components/pages/legal/CookiePolicy';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Main Pages */}
            <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
            <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="/fees" element={<AnimatedPage><FeeCollection /></AnimatedPage>} />
            <Route path="/alumni" element={<AnimatedPage><AlumniPortal /></AnimatedPage>} />
            <Route path="/campus-tour" element={<AnimatedPage><CampusTour /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
            <Route path="/campus-life" element={<AnimatedPage><CampusLifePage /></AnimatedPage>} />
            <Route path="/messaging" element={<AnimatedPage><MessagingPage /></AnimatedPage>} />

            {/* Registration Flow */}
            <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
            <Route path="/register/school" element={<AnimatedPage><SchoolRegister /></AnimatedPage>} />
            <Route path="/register/teacher" element={<AnimatedPage><TeacherRegister /></AnimatedPage>} />
            <Route path="/register/student" element={<AnimatedPage><StudentRegister /></AnimatedPage>} />
            <Route path="/verify/:userType" element={<AnimatedPage><OtpVerification /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
            <Route path="/onboarding/school" element={<AnimatedPage><SchoolOnboarding /></AnimatedPage>} />
            <Route path="/onboarding/teacher" element={<AnimatedPage><TeacherOnboarding /></AnimatedPage>} />
            <Route path="/onboarding/student" element={<AnimatedPage><StudentOnboarding /></AnimatedPage>} />
          
            {/* Student Pages */}
            <Route path="/profile" element={<AnimatedPage><UserProfile /></AnimatedPage>} />
            <Route path="/attendance" element={<AnimatedPage><Attendance /></AnimatedPage>} />
            <Route path="/grades" element={<AnimatedPage><Grades /></AnimatedPage>} />
            <Route path="/timetable" element={<AnimatedPage><Timetable /></AnimatedPage>} />
            <Route path="/extracurriculars" element={<AnimatedPage><Extracurriculars /></AnimatedPage>} />
            <Route path="/guidance" element={<AnimatedPage><FutureGuidance /></AnimatedPage>} />
            <Route path="/library-catalog" element={<AnimatedPage><LibraryCatalogPage /></AnimatedPage>} />
            <Route path="/hostel-services" element={<AnimatedPage><HostelServices /></AnimatedPage>} />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
            <Route path="/terms-of-service" element={<AnimatedPage><TermsOfService /></AnimatedPage>} />
            <Route path="/cookie-policy" element={<AnimatedPage><CookiePolicy /></AnimatedPage>} />
          
            {/* Teacher Pages routes */}
            <Route path="/teacher/profile" element={<AnimatedPage><TeacherProfile /></AnimatedPage>} />
            <Route path="/teacher/my-classes" element={<AnimatedPage><MyClasses /></AnimatedPage>} />
            <Route path="/teacher/upload-marks" element={<AnimatedPage><UploadMarks /></AnimatedPage>} />
            <Route path="/teacher/upload-attendance" element={<AnimatedPage><UploadAttendance /></AnimatedPage>} />
            <Route path="/teacher/homeroom" element={<AnimatedPage><Homeroom /></AnimatedPage>} />
            <Route path="/teacher/detailed-attendance" element={<AnimatedPage><DetailedAttendance /></AnimatedPage>} />
            <Route path="/teacher/bus-duty" element={<AnimatedPage><BusDutyPage /></AnimatedPage>} />

            {/* Admin Pages routes */}
            <Route path="/admin/transport" element={<AnimatedPage><TransportAdmin /></AnimatedPage>} />
            <Route path="/admin/hostel" element={<AnimatedPage><HostelAdmin /></AnimatedPage>} />
            <Route path="/admin/library" element={<AnimatedPage><LibraryAdmin /></AnimatedPage>} />
            <Route path="/admin/library/books" element={<AnimatedPage><LibraryBooks /></AnimatedPage>} />
            <Route path="/admin/students" element={<AnimatedPage><StudentsAdmin /></AnimatedPage>} />
            <Route path="/admin/teachers" element={<AnimatedPage><TeachersAdmin /></AnimatedPage>} />
            <Route path="/admin/staff" element={<AnimatedPage><StaffAdmin /></AnimatedPage>} />
            <Route path="/admin/finances" element={<AnimatedPage><FinancesAdmin /></AnimatedPage>} />
            <Route path="/admin/placements" element={<AnimatedPage><PlacementsAdmin /></AnimatedPage>}/>
            <Route path="/admin/timetable-generator" element={<AnimatedPage><TimetableGenerator /></AnimatedPage>} />
            <Route path="/admin/complaints" element={<AnimatedPage><ComplaintsLog /></AnimatedPage>} />
            <Route path="/admin/labs" element={<AnimatedPage><LabInventory /></AnimatedPage>} />
            <Route path="/admin/data-transfer" element={<AnimatedPage><DataTransfer /></AnimatedPage>} />

          </Routes>
        </AnimatePresence>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}

export default App;

