// server/routes/leaderboard.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Drive = require('../models/Drive');

router.get('/', async (req, res) => {
  try {
    // Top Donors (by total donation amount)
    const topDonors = await Donation.aggregate([
      { $group: { _id: '$donor', totalDonated: { $sum: '$amount' } } },
      { $sort: { totalDonated: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'donorDetails',
        },
      },
      { $unwind: '$donorDetails' },
      {
        $project: {
          _id: 1,
          totalDonated: 1,
          name: '$donorDetails.name',
        },
      },
    ]);

    // Top Beneficiaries (by total raised amount across their drives)
    const topBeneficiaries = await Drive.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$creator',
          totalRaised: { $sum: '$raisedAmount' },
        },
      },
      { $sort: { totalRaised: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'beneficiaryDetails',
        },
      },
      { $unwind: '$beneficiaryDetails' },
      {
        $project: {
          _id: 1,
          totalRaised: 1,
          name: '$beneficiaryDetails.name',
        },
      },
    ]);

    res.json({ topDonors, topBeneficiaries });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;