import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DriveCard from '../components/DriveCard'; // Import DriveCard component
import './DonationPage.css';

const DonationPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const res = await axios.get('http://localhost:5000/api/drives', {
          headers: { 'x-auth-token': token },
        });
        setDrives(res.data);
      } catch (err) {
        console.error('Error fetching drives:', {
          message: err.message,
          response: err.response?.data,
        });
        setError('Failed to load drives');
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="donation-page">
      <h1 className="page-title">Donation Drives</h1>
      <div className="drives-grid">
        {drives.map((drive) => (
          <DriveCard
            key={drive._id}
            drive={{
              ...drive,
              creatorName: drive.creator?.name || 'Unknown',
              raisedAmount: drive.raisedAmount || 0,
              backers: drive.backers || 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DonationPage;