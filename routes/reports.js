const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Donation = require('../models/Donation');
const Drive = require('../models/Drive');

// Get Donation Report (Admin)
router.get('/donations', auth(['admin']), async (req, res) => {
  try {
    const donations = await Donation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 },
        },
      },
      {
        $project: {
          period: { $concat: ['$_id.year', '-', { $toString: '$_id.month' }] },
          totalAmount: 1,
          donationCount: 1,
          _id: 0,
        },
      },
      { $sort: { period: 1 } },
    ]);

    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Drive Report (Admin)
router.get('/drives', auth(['admin']), async (req, res) => {
  try {
    const drives = await Drive.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalMonetaryGoal: { $sum: '$monetaryGoal' },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          totalMonetaryGoal: 1,
          _id: 0,
        },
      },
    ]);

    res.json(drives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;