import React, { useState } from 'react';
import axios from 'axios';

const CreateDrive = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [], // Will store base64-encoded images
    itemsNeeded: [],
    monetaryGoal: 0,
    location: '',
    startDate: '',
    endDate: '',
  });
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Base64-encoded image
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setFormData({ ...formData, images: [...formData.images, ...images] });
    }).catch(err => {
      console.error('Error processing images:', err);
      setError('Failed to process images');
    });
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setFormData({ ...formData, itemsNeeded: [...formData.itemsNeeded, newItem.trim()] });
      setNewItem('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting drive with data:', formData); // Log the data being sent
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Log the token to verify it's present
      if (!token) throw new Error('No authentication token found');

      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/drives`, formData, {
        headers: { 'x-auth-token': token },
      });
      console.log('Drive created successfully:', res.data); // Log the successful response
      alert('Drive created successfully!');
      setFormData({
        title: '',
        description: '',
        images: [],
        itemsNeeded: [],
        monetaryGoal: 0,
        location: '',
        startDate: '',
        endDate: '',
      });
      setError('');
    } catch (err) {
      console.error('Error creating drive:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      }); // Detailed error logging
      const errorMsg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || err.message || 'Failed to create drive';
      setError(errorMsg);
    }
  };

  return (
    <div className="create-drive-container">
      <h1 className="create-drive-title">Create a New Drive</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="create-drive-form">
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required />
        </div>
        <div className="form-group">
          <label>Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          <div className="image-preview">
            {formData.images.map((image, index) => (
              <img key={index} src={image} alt={`Preview ${index}`} className="preview-image" style={{ maxWidth: '100px', margin: '5px' }} />
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Items Needed</label>
          <div className="item-input">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="e.g., Clothes, Food"
            />
            <button type="button" onClick={handleAddItem}>Add</button>
          </div>
          <ul className="item-list">
            {formData.itemsNeeded.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="form-group">
          <label>Monetary Goal (₹)</label>
          <input
            type="number"
            name="monetaryGoal"
            value={formData.monetaryGoal}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-btn">Create Drive</button>
      </form>
    </div>
  );
};

export default CreateDrive;