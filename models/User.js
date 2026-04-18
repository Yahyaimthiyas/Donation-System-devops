const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['donor', 'beneficiary', 'admin'],
    required: true,
  },
  
  // Professional Verification & Profile Fields
  phoneNumber: { type: String },
  aadhaarNumber: { type: String }, // Store for verification purposes
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false }, // Admin manually toggles this
  
  location: {
    city: String,
    state: String,
    pincode: String,
    fullAddress: String
  },
  bio: { type: String },
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);