import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/drives/my-drives`, {
        headers: { 'x-auth-token': token },
      });
      const formattedDrives = res.data.map((drive) => ({
        ...drive,
        raisedAmount: drive.raisedAmount || 0,
        backers: drive.backers || 0,
      }));
      setDrives(formattedDrives);
    } catch (err) {
      console.error('Error fetching drives:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="my-drives-container">
      <h1 className="page-title">My Drives</h1>
      <div className="my-drives-grid">
        {drives.map((drive) => (
          <div key={drive._id} className="my-drive-card">
            <img
              src={drive.images[0] || 'https://via.placeholder.com/150'}
              alt={drive.title}
              className="my-drive-image"
            />
            <div className="my-drive-content">
              <h3 className="my-drive-title">{drive.title}</h3>
              <p className="my-drive-status">
                Status: <span className={drive.status === 'approved' ? 'status-approved' : drive.status === 'pending' ? 'status-pending' : 'status-declined'}>{drive.status}</span>
              </p>
              <p className="my-drive-location">Location: {drive.location}</p>
              <p className="my-drive-goal">Monetary Goal: ₹{drive.monetaryGoal || 0}</p>
              <p className="my-drive-raised">Amount Raised: ₹{drive.raisedAmount}</p>
              <p className="my-drive-backers">Backers: {drive.backers}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDrives;