import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DriveCard from '../components/DriveCard';

const DriveList = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/drives`);
      const formattedDrives = res.data.map((drive) => ({
        ...drive,
        creator: { name: drive.creator?.name || 'Unknown' }, // Ensure creator object is formatted
        raisedAmount: drive.raisedAmount || 0,
        monetaryGoal: drive.monetaryGoal || 50000, // Use monetaryGoal directly
        backers: drive.backers || 0,
        images: drive.images || [],
      }));
      console.log('Fetched drives:', formattedDrives);
      setDrives(formattedDrives);
    } catch (err) {
      console.error('Error fetching drives:', err.message);
      setError('Failed to load drives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedDrive) => {
    setDrives((prevDrives) =>
      prevDrives.map((drive) =>
        drive._id === updatedDrive._id
          ? {
              ...drive,
              ...updatedDrive,
              creator: { name: updatedDrive.creator?.name || drive.creator?.name || 'Unknown' },
              raisedAmount: updatedDrive.raisedAmount || drive.raisedAmount,
              backers: updatedDrive.backers || drive.backers,
            }
          : drive
      )
    );
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="drive-list">
      <h1 className="page-title">Ongoing Drives</h1>
      <div className="drives-grid">
        {drives.map((drive) => (
          <DriveCard key={drive._id} drive={drive} onUpdate={handleUpdate} />
        ))}
      </div>
    </div>
  );
};

export default DriveList;