import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [topDonors, setTopDonors] = useState([]);
  const [topBeneficiaries, setTopBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/leaderboard`, {
          headers: { 'x-auth-token': token },
          credentials: 'include',
        });

        if (res.data && res.data.topDonors) setTopDonors(res.data.topDonors);
        if (res.data && res.data.topBeneficiaries) setTopBeneficiaries(res.data.topBeneficiaries);
      } catch (err) {
        setError('Failed to fetch leaderboard');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      {error && <p className="error">{error}</p>}
      
      <div className="leaderboard-section">
        <h2>Top Donors</h2>
        {topDonors.length > 0 ? (
          <ul className="leaderboard-list">
            {topDonors.map((donor, index) => (
              <li key={donor._id} className="leaderboard-item">
                {index + 1}. {donor.name} - ₹{donor.totalDonated.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No donors to display yet.</p>
        )}
      </div>

      <div className="leaderboard-section">
        <h2>Top Beneficiaries</h2>
        {topBeneficiaries.length > 0 ? (
          <ul className="leaderboard-list">
            {topBeneficiaries.map((beneficiary, index) => (
              <li key={beneficiary._id} className="leaderboard-item">
                {index + 1}. {beneficiary.name} - ₹{beneficiary.totalRaised.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No beneficiaries to display yet.</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;