import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalDrives: 0,
    totalDonations: 0,
    totalUsers: 0,
    totalAmountRaised: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const drivesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/drives/my-drives`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        const donationsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/donations`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        const usersRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });

        setStats({
          totalDrives: drivesRes.data.length,
          totalDonations: donationsRes.data.length,
          totalUsers: usersRes.data.length,
          totalAmountRaised: donationsRes.data.reduce((sum, d) => sum + (d.amount || 0), 0),
        });
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch statistics');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="statistics-container">
      <h1 className="page-title">Platform Statistics</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="stats-grid">
        <div className="stat-card">
          <h2 className="stat-title">Total Drives</h2>
          <p className="stat-value">{stats.totalDrives}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-title">Total Donations</h2>
          <p className="stat-value">{stats.totalDonations}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-title">Total Users</h2>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-title">Amount Raised</h2>
          <p className="stat-value">₹{stats.totalAmountRaised}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;