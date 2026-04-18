import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users`, formData, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      const updatedUser = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setUser(updatedUser.data);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  return (
    <div className="fade-in" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Profile</h1>
      {error && <p style={{ color: '#EF4444', marginBottom: '20px' }}>{error}</p>}
      <div style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', color: 'white', backgroundColor: '#1D4ED8', cursor: 'pointer', border: 'none', width: '100%', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => (e.target.style.backgroundColor = '#1E40AF')} onMouseOut={(e) => (e.target.style.backgroundColor = '#1D4ED8')}>Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;