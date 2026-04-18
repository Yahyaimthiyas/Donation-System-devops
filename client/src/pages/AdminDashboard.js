import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/drives/my-drives`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        // Filter out any null or undefined drives
        const validDrives = res.data.filter(drive => drive && drive._id && drive.title);
        setDrives(validDrives);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch drives');
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  const handleStatusChange = async (driveId, status, comment) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/drives/${driveId}/status`,
        { status, comment },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setDrives(drives.map(drive =>
        drive._id === driveId ? { ...drive, status, adminComment: comment } : drive
      ));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update drive status');
    }
  };

  const handleDelete = async (driveId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/drives/${driveId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setDrives(drives.filter(drive => drive._id !== driveId));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete drive');
    }
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1 className="page-title">Admin Dashboard - Approve Drives</h1>
      {error && <p className="error-message">{error}</p>}
      {drives.length === 0 ? (
        <p>No drives available to review.</p>
      ) : (
        <div className="admin-drives-grid">
          {drives.map(drive => (
            <div key={drive._id} className="admin-drive-card">
              <img
                src={drive.images[0] || 'https://via.placeholder.com/150'}
                alt={drive.title || 'Drive Image'}
                className="admin-drive-image"
              />
              <div className="admin-drive-content">
                <h3 className="admin-drive-title">{drive.title}</h3>
                <p className="admin-drive-creator">Creator: {drive.creator?.name || 'Unknown'}</p>
                <p className="admin-drive-status">
                  Status: <span className={drive.status === 'approved' ? 'status-approved' : drive.status === 'pending' ? 'status-pending' : 'status-declined'}>{drive.status}</span>
                </p>
                <p className="admin-drive-location">Location: {drive.location || 'N/A'}</p>
                <p className="admin-drive-goal">Monetary Goal: ₹{drive.monetaryGoal || 0}</p>
                <p className="admin-drive-raised">Amount Raised: ₹{drive.raisedAmount || 0}</p>
                <p className="admin-drive-backers">Backers: {drive.backers || 0}</p>
                {drive.status === 'pending' && (
                  <div className="admin-drive-actions">
                    <button
                      onClick={() => handleStatusChange(drive._id, 'approved', '')}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const comment = prompt('Enter reason for declining:');
                        if (comment) handleStatusChange(drive._id, 'declined', comment);
                      }}
                      className="decline-btn"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleDelete(drive._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                )}
                {drive.adminComment && (
                  <p className="admin-drive-comment">Admin Comment: {drive.adminComment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;