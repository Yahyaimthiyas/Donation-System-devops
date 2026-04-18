import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="fade-in" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>Welcome to the Donation Platform</h1>
      <p style={{ fontSize: '18px', marginBottom: '40px' }}>Connect donors and beneficiaries to make a difference together.</p>
      {user ? (
        <div>
          <p style={{ marginBottom: '20px' }}>Hello, {user.name}! You are logged in as a {user.role}.</p>
          {user.role === 'donor' && <Link to="/drives" style={{ padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', color: 'white', backgroundColor: '#1D4ED8', textDecoration: 'none', marginRight: '10px', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => (e.target.style.backgroundColor = '#1E40AF')} onMouseOut={(e) => (e.target.style.backgroundColor = '#1D4ED8')}>Find Drives to Donate</Link>}
          {user.role === 'beneficiary' && <Link to="/create-drive" style={{ padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', color: 'white', backgroundColor: '#1D4ED8', textDecoration: 'none', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => (e.target.style.backgroundColor = '#1E40AF')} onMouseOut={(e) => (e.target.style.backgroundColor = '#1D4ED8')}>Create a Drive</Link>}
          {user.role === 'admin' && <Link to="/admin" style={{ padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', color: 'white', backgroundColor: '#1D4ED8', textDecoration: 'none', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => (e.target.style.backgroundColor = '#1E40AF')} onMouseOut={(e) => (e.target.style.backgroundColor = '#1D4ED8')}>Go to Admin Dashboard</Link>}
        </div>
      ) : (
        <div>
          <Link to="/register" style={{ padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', color: 'white', backgroundColor: '#1D4ED8', textDecoration: 'none', marginRight: '10px', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => (e.target.style.backgroundColor = '#1E40AF')} onMouseOut={(e) => (e.target.style.backgroundColor = '#1D4ED8')}>Get Started</Link>
          <Link to="/login" style={{ padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', color: 'white', backgroundColor: '#10B981', textDecoration: 'none', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => (e.target.style.backgroundColor = '#059669')} onMouseOut={(e) => (e.target.style.backgroundColor = '#10B981')}>Login</Link>
        </div>
      )}
    </div>
  );
};

export default Home;