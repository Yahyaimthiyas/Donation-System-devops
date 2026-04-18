import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, notifications } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" style={{ backgroundColor: '#1D4ED8', color: 'white', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>Donation Platform</Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/drives" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Drives</Link>
          <Link to="/leaderboard" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Leaderboard</Link>
          <Link to="/faq" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>FAQ</Link>
          <Link to="/about" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>About</Link>
          <Link to="/contact" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Contact</Link>
          {user ? (
            <>
              {user.role === 'donor' && <Link to="/donations" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>My Donations</Link>}
              {user.role === 'beneficiary' && <Link to="/create-drive" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Create Drive</Link>}
              {user.role === 'admin' && <Link to="/admin" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Admin Dashboard</Link>}
              <Link to="/notifications" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, position: 'relative' }}>
                Notifications
                {notifications.length > 0 && (
                  <span style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: '#EF4444', color: 'white', borderRadius: '50%', padding: '2px 6px' }}>
                    {notifications.length}
                  </span>
                )}
              </Link>
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Profile</Link>
              <button onClick={handleLogout} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Login</Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;