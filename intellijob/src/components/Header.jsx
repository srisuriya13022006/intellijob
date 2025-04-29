import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/Authcontext';
import '../styles/header.css';

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Move useAuth to top level

  // Determine username to display
  const userName = currentUser ? (currentUser.displayName || currentUser.email) : 'Guest';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location]);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Use logout from top-level useAuth
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
    setIsProfileMenuOpen(false);
  };

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and Navigation */}
        <div className="header-content">
          {/* Logo */}
          <div className="logo-section">
            <Link to="/" className="logo-link">
              <div className="logo-icon">
                <span>IJ</span>
              </div>
              <span className="logo-text">IntelliJob</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="main-nav">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/ats"
              className={`nav-link ${isActive('/ats') ? 'active' : ''}`}
            >
              ATS Checker
            </Link>
            <Link
              to="/upload-resume"
              className={`nav-link ${isActive('/upload-resume') ? 'active' : ''}`}
            >
              Upload Resume
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              Profile
            </Link>
          </nav>

          {/* User Profile */}
          <div className="user-profile" ref={dropdownRef}>
            <button
              onClick={toggleProfileMenu}
              className="profile-button"
              aria-label="User menu"
              aria-expanded={isProfileMenuOpen}
            >
              <div className="user-avatar">
                <User size={18} />
              </div>
              <span className="user-name">{userName}</span>
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">
                  <User size={16} className="dropdown-icon" />
                  <span>Your Profile</span>
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <Settings size={16} className="dropdown-icon" />
                  <span>Settings</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button
                  onClick={handleLogout}
                  className="dropdown-item logout-button"
                >
                  <LogOut size={16} className="dropdown-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;