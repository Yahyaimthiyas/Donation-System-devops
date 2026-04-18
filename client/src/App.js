import React, { useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DriveList from './pages/DriveList';
import CreateDrive from './pages/CreateDrive';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Statistics from './pages/Statistics';
import MyDrives from './pages/MyDrives';
import PrivateRoute from './components/PrivateRoute';
import './styles/App.css';

function App() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNav = () => {
    if (!user) {
      return (
        <nav className="navbar">
          <div className="container">
            <h1 className="logo">Charity Platform</h1>
            <ul className="nav-links">
              <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
              <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a></li>
              <li><a href="/faq" onClick={(e) => { e.preventDefault(); navigate('/faq'); }}>FAQ</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a></li>
              <li><a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a></li>
              <li><a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Register</a></li>
            </ul>
          </div>
        </nav>
      );
    }

    switch (user.role) {
      case 'donor':
        return (
          <nav className="navbar">
            <div className="container">
              <h1 className="logo">Charity Platform</h1>
              <ul className="nav-links">
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
                <li><a href="/drives" onClick={(e) => { e.preventDefault(); navigate('/drives'); }}>Donations</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a></li>
                <li><a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>Profile</a></li>
                <li><a href="/notifications" onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}>Notifications</a></li>
                <li><a href="/faq" onClick={(e) => { e.preventDefault(); navigate('/faq'); }}>FAQ</a></li>
                <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a></li>
                <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
              </ul>
            </div>
          </nav>
        );
      case 'beneficiary':
        return (
          <nav className="navbar">
            <div className="container">
              <h1 className="logo">Charity Platform</h1>
              <ul className="nav-links">
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
                <li><a href="/create-drive" onClick={(e) => { e.preventDefault(); navigate('/create-drive'); }}>Create Drive</a></li>
                <li><a href="/my-drives" onClick={(e) => { e.preventDefault(); navigate('/my-drives'); }}>My Drives</a></li>
                <li><a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>Profile</a></li>
                <li><a href="/notifications" onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}>Notifications</a></li>
                <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
              </ul>
            </div>
          </nav>
        );
      case 'admin':
        return (
          <nav className="navbar">
            <div className="container">
              <h1 className="logo">Charity Platform</h1>
              <ul className="nav-links">
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
                <li><a href="/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>Approve Drives</a></li>
                <li><a href="/statistics" onClick={(e) => { e.preventDefault(); navigate('/statistics'); }}>Statistics</a></li>
                <li><a href="/leaderboard" onClick={(e) => { e.preventDefault(); navigate('/leaderboard'); }}>Leaderboard</a></li>
                <li><a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>Profile</a></li>
                <li><a href="/notifications" onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}>Notifications</a></li>
                <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
              </ul>
            </div>
          </nav>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      {renderNav()}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/drives" element={<PrivateRoute roles={['donor']}><DriveList /></PrivateRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create-drive" element={<PrivateRoute roles={['beneficiary']}><CreateDrive /></PrivateRoute>} />
          <Route path="/my-drives" element={<PrivateRoute roles={['beneficiary']}><MyDrives /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/statistics" element={<PrivateRoute roles={['admin']}><Statistics /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute roles={['donor', 'beneficiary', 'admin']}><Notifications /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute roles={['donor', 'beneficiary', 'admin']}><Profile /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}