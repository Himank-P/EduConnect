import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleLinkClick();
    navigate('/');
  };

  return (
    <>
      <div className={menuOpen ? "overlay show" : "overlay"} onClick={() => setMenuOpen(false)}></div>
      <header className="main-header">
        <div className="container">
          <Link to={user ? "/dashboard" : "/"} className="logo" onClick={handleLinkClick}>EduConnect</Link>
          
          <button className={menuOpen ? "hamburger-menu open" : "hamburger-menu"} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          <nav className={menuOpen ? "main-nav open" : "main-nav"}>
            <ul>
              {!user && <li><NavLink to="/" onClick={handleLinkClick}>Home</NavLink></li>}
              
              {user && <li><NavLink to="/dashboard" onClick={handleLinkClick}>Dashboard</NavLink></li>}
              
              {user?.role === 'student' && (
                <>
                  <li><NavLink to="/alumni" onClick={handleLinkClick}>Alumni</NavLink></li>
                  <li><NavLink to="/campus-tour" onClick={handleLinkClick}>Campus Tour</NavLink></li>
                  <li><NavLink to="/guidance" onClick={handleLinkClick}>Guidance</NavLink></li>
                </>
              )}

              {user?.role === 'teacher' && (
                <>
                    <li><NavLink to="/teacher/my-classes" onClick={handleLinkClick}>My Classes</NavLink></li>
                    <li><NavLink to="/teacher/homeroom" onClick={handleLinkClick}>Homeroom</NavLink></li>
                </>
              )}
              
              {user?.role === 'school' && (
                <>
                    <li><NavLink to="/admin/students" onClick={handleLinkClick}>Students</NavLink></li>
                    <li><NavLink to="/admin/teachers" onClick={handleLinkClick}>Teachers</NavLink></li>
                    <li><NavLink to="/admin/finances" onClick={handleLinkClick}>Finances</NavLink></li>
                </>
              )}

              {user && <li><NavLink to="/messaging" onClick={handleLinkClick}>Messaging</NavLink></li>}

              <li><NavLink to="/contact" onClick={handleLinkClick}>Contact</NavLink></li>
              
              {user ? (
                <li><button onClick={handleLogout} className="register-link logout-button">Logout</button></li>
              ) : (
                <li><NavLink to="/login" onClick={handleLinkClick} className="register-link">Login</NavLink></li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;

