const mongoose = require('mongoose');

const DriveSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  images: [{ type: String }],
  itemsNeeded: [{ type: String }],
  monetaryGoal: { type: Number, default: 0 },
  location: { type: String, required: [true, 'Location is required'] },
  startDate: { type: Date, required: [true, 'Start date is required'] },
  endDate: { type: Date, required: [true, 'End date is required'] },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Creator is required'] },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  adminComment: { type: String },
  updates: [{ text: String, image: String, date: { type: Date, default: Date.now } }],
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Drive', DriveSchema);