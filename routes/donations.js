const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Donation = require('../models/Donation');
const Drive = require('../models/Drive');
const Notification = require('../models/Notification');

// Create Donation (Donor)
router.post('/', auth('donor'), async (req, res) => {
  const { drive, type, amount, items, paymentMethod } = req.body;

  try {
    const driveDoc = await Drive.findById(drive);
    if (!driveDoc) return res.status(404).json({ msg: 'Drive not found' });

    const donation = new Donation({
      drive,
      donor: req.user.id,
      type,
      amount: type === 'monetary' ? amount : undefined,
      items: type === 'item' ? items : undefined,
      paymentMethod,
    });

    await donation.save();

    driveDoc.donations.push(donation._id);
    await driveDoc.save();

    const notification = new Notification({
      user: driveDoc.creator,
      message: `New donation of ₹${amount || 0} to your drive "${driveDoc.title}"`,
      type: 'donation',
    });
    await notification.save();

    const io = req.app.get('io');
    io.to(driveDoc.creator.toString()).emit('notification', notification);

    res.json(donation);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Confirm Donation Delivery (Beneficiary)
router.put('/:id/confirm', auth(['beneficiary']), async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('drive');
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });
    if (donation.drive.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    donation.status = 'delivered';
    await donation.save();

    const notification = new Notification({
      user: donation.donor,
      message: `Your donation to "${donation.drive.title}" has been confirmed as delivered.`,
      type: 'donation',
    });
    await notification.save();

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(donation.donor.toString()).emit('notification', notification);

    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Donation History (Donor)
router.get('/my-donations', auth(['donor']), async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('drive', 'title')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Donations for a Drive (Beneficiary or Admin)
router.get('/drive/:driveId', auth(['beneficiary', 'admin']), async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).json({ msg: 'Drive not found' });
    if (req.user.role !== 'admin' && drive.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const donations = await Donation.find({ drive: req.params.driveId })
      .populate('donor', 'name')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Get All Donations (Admin)
router.get('/', auth('admin'), async (req, res) => {
  try {
    const donations = await Donation.find().populate('drive', 'title').populate('donor', 'name');
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;