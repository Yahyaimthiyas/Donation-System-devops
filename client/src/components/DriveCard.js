import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const DriveCard = ({ drive, onUpdate }) => {
  const [showShare, setShowShare] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');

  const handleShare = (platform) => {
    const url = `${window.location.origin}/drive/${drive._id}`;
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        shareUrl = `https://www.instagram.com/share?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this drive: ${drive.title} - ${url}`)}`;
        break;
      default:
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShare(false);
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || !paymentMethod) {
      setError('Please enter an amount and select a payment method');
      return;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to donate');
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/drives/${drive._id}/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ amount: parsedAmount, paymentMethod }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to process donation');
      }

      const data = await res.json();
      if (onUpdate) onUpdate(data);
      setShowDonate(false);
      setAmount('');
      setPaymentMethod('');
      alert('Donation successful!');
    } catch (err) {
      setError(`Failed to donate: ${err.message}. Check network tab for details.`);
    }
  };

  const progress = drive.monetaryGoal ? ((drive.raisedAmount || 0) / drive.monetaryGoal) * 100 : 0;

  return (
    <div className="drive-card">
      <img src={drive.images[0] || 'https://via.placeholder.com/150'} alt={drive.title} className="drive-image" />
      <div className="drive-content">
        <h3 className="drive-title">{drive.title}</h3>
        <p className="drive-creator">By {drive.creator?.name || 'Unknown'}</p>
        <p className="drive-description">{drive.description.substring(0, 100)}{drive.description.length > 100 ? '...' : ''}</p>
        <div className="drive-stats">
          <span className="drive-raised">₹{drive.raisedAmount || 0} Raised of ₹{drive.monetaryGoal || 0}</span>
          <span className="drive-backers">{drive.backers || 0} Backers</span>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="drive-actions">
          <button className="share-btn" onClick={() => setShowShare(true)}>Share</button>
          <button className="donate-btn" onClick={() => setShowDonate(true)}>Donate Now</button>
        </div>
      </div>

      {showShare && (
        <div className="share-modal">
          <div className="share-content">
            <h4>Share on:</h4>
            <button onClick={() => handleShare('facebook')}><FaFacebookF /> Facebook</button>
            <button onClick={() => handleShare('instagram')}><FaInstagram /> Instagram</button>
            <button onClick={() => handleShare('whatsapp')}><FaWhatsapp /> WhatsApp</button>
            <button onClick={() => setShowShare(false)}>Close</button>
          </div>
        </div>
      )}

      {showDonate && (
        <div className="donate-modal">
          <div className="modal-content">
            <h4>Donate to {drive.title}</h4>
            <form onSubmit={handleDonate}>
              <div className="form-group">
                <label>Amount (₹)</label>
                <div className="preset-amounts">
                  {[100, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
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
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-options">
                  {['UPI', 'Credit Card', 'PayPal'].map((method) => (
                    <button
                      key={method}
                      type="button"
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
                <button type="submit" className="donate-modal-btn">Donate</button>
                <button type="button" className="cancel-btn" onClick={() => setShowDonate(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveCard;