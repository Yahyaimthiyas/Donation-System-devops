const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Enforce lowercase
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['donor', 'beneficiary', 'admin'],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);