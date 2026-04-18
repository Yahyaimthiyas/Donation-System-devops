import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Donate = () => {
  const { id } = useParams(); // Get the drive ID from the URL
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const res = await axios.get(`http://localhost:5000/api/drives/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setDrive(res.data);
      } catch (err) {
        console.error('Error fetching drive:', {
          message: err.message,
          response: err.response?.data,
        });
        setError('Failed to load drive details');
      } finally {
        setLoading(false);
      }
    };
    fetchDrive();
  }, [id]);

  const handleDonate = async () => {
    if (!amount || !paymentMethod) {
      setError('Please enter an amount and select a payment method');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/drives/${id}/donate`,
        { amount, paymentMethod },
        { headers: { 'x-auth-token': token } }
      );
      alert('Donation successful!');
      navigate('/donations');
    } catch (err) {
      console.error('Error making donation:', {
        message: err.message,
        response: err.response?.data,
      });
      setError('Failed to process donation');
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!drive) return <p className="error">Drive not found</p>;

  return (
    <div className="donate-container">
      <h1 className="page-title">Donate to {drive.title}</h1>
      <div className="donate-form">
        <div className="form-group">
          <label>Amount (₹)</label>
          <div className="preset-amounts">
            {[100, 500, 1000].map((preset) => (
              <button
                key={preset}
                className={`preset-btn ${amount === preset.toString() ? 'selected' : ''}`}
                onClick={() => setAmount(preset.toString())}
              >
                ₹{preset}
              </button>
            ))}
          </div>
          <input
            type="number"
            className="amount-input"
            placeholder="Enter custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Payment Method</label>
          <div className="payment-options">
            {['UPI', 'Credit Card', 'PayPal'].map((method) => (
              <button
                key={method}
                className={`payment-btn ${paymentMethod === method ? 'selected' : ''}`}
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="modal-actions">
          <button className="donate-modal-btn" onClick={handleDonate}>
            Donate Now
          </button>
          <button className="cancel-btn" onClick={() => navigate('/drives')}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Donate;