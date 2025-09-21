import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import './components/styles.css';

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
import CampusTour from './components/CampusTour'; // Import new Campus Tour

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          {/* Existing Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fees" element={<FeeCollection />} />
          <Route path="/alumni" element={<AlumniPortal />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/school" element={<SchoolRegister />} />
          <Route path="/register/teacher" element={<TeacherRegister />} />
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/verify/:userType" element={<OtpVerification />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/timetable" element={<Timetable />} />

          {/* New Campus Tour Route */}
          <Route path="/campus-tour" element={<CampusTour />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

