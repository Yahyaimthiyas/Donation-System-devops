import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
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
import Reports from './pages/Reports';
import Statistics from './pages/Statistics';
import MyDrives from './pages/MyDrives';
import DriveDetail from './pages/DriveDetail';
import EditDrive from './pages/EditDrive';
import PrivateRoute from './components/PrivateRoute';
import './styles/App.css';

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <div className="fade-in" style={{ color: 'var(--primary)', fontWeight: '600' }}>Initalizing Platform...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/drives" element={<PrivateRoute roles={['donor', 'admin']}><DriveList /></PrivateRoute>} />
          <Route path="/drives/:id" element={<PrivateRoute roles={['donor', 'admin']}><DriveDetail /></PrivateRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create-drive" element={<PrivateRoute roles={['beneficiary']}><CreateDrive /></PrivateRoute>} />
          <Route path="/my-drives" element={<PrivateRoute roles={['beneficiary']}><MyDrives /></PrivateRoute>} />
          <Route path="/edit-drive/:id" element={<PrivateRoute roles={['beneficiary']}><EditDrive /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute roles={['admin']}><Reports /></PrivateRoute>} />
          <Route path="/statistics" element={<PrivateRoute roles={['admin']}><Statistics /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute roles={['donor', 'beneficiary', 'admin']}><Notifications /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute roles={['donor', 'beneficiary', 'admin']}><Profile /></PrivateRoute>} />
        </Routes>
      </main>
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