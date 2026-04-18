const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Drive = require('../models/Drive');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create Drive (Beneficiary)
router.post(
  '/',
  [
    auth('beneficiary'),
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('startDate', 'Start date is required').isISO8601(),
    check('endDate', 'End date is required').isISO8601(),
    check('monetaryGoal', 'Monetary goal must be a number').optional().isNumeric(),
    check('images', 'Images must be an array').optional().isArray(),
    check('itemsNeeded', 'Items needed must be an array').optional().isArray(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, images, itemsNeeded, monetaryGoal, location, startDate, endDate } = req.body;

    try {
      const drive = new Drive({
        title,
        description,
        images: images || [],
        itemsNeeded: itemsNeeded || [],
        monetaryGoal: monetaryGoal || 0,
        location,
        startDate,
        endDate,
        creator: req.user.id,
        status: 'pending',
      });

      await drive.save();

      // Notify the creator (beneficiary)
      const creatorNotification = new Notification({
        user: req.user.id,
        message: `Your drive "${title}" has been submitted for approval.`,
        type: 'drive',
      });
      await creatorNotification.save();

      // Notify all admin users
      const admins = await User.find({ role: 'admin' }).select('_id');
      const adminNotifications = admins.map((admin) => ({
        user: admin._id,
        message: `A new drive "${title}" has been submitted for approval.`,
        type: 'drive',
      }));
      await Notification.insertMany(adminNotifications);

      const io = req.app.get('io');
      if (io) {
        io.to(req.user.id.toString()).emit('notification', creatorNotification);
        adminNotifications.forEach((notification) => {
          io.to(notification.user.toString()).emit('notification', notification);
        });
      }

      res.json(drive);
    } catch (error) {
      console.error('Error creating drive:', error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// Get All Approved Drives (Public)
router.get('/', async (req, res) => {
  try {
    const drives = await Drive.find({ status: 'approved' })
      .populate('creator', 'name')
      .populate('donations')
      .lean();

    const drivesWithStats = await Promise.all(drives.map(async (drive) => {
      const donations = await Donation.find({ drive: drive._id });
      const raisedAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
      const backers = [...new Set(donations.map(donation => donation.donor.toString()))].length;
      return { ...drive, raisedAmount, backers };
    }));

    const validDrives = drivesWithStats.filter(drive => drive && drive._id && drive.title);
    res.json(validDrives);
  } catch (error) {
    console.error('Error fetching approved drives:', error.message);
    res.status(500).json({ msg: 'Server error' });
    }
});

// Get Drives by Beneficiary or Admin
router.get('/my-drives', auth(), async (req, res) => {
  try {
    let drives;
    if (req.user.role === 'admin') {
      drives = await Drive.find()
        .populate('creator', 'name')
        .populate('donations')
        .lean();
    } else if (req.user.role === 'beneficiary') {
      drives = await Drive.find({ creator: req.user.id })
        .populate('creator', 'name')
        .populate('donations')
        .lean();
    } else {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }

    const drivesWithStats = await Promise.all(drives.map(async (drive) => {
      const donations = await Donation.find({ drive: drive._id });
      const raisedAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
      const backers = [...new Set(donations.map(donation => donation.donor.toString()))].length;
      return { ...drive, raisedAmount, backers };
    }));

    const validDrives = drivesWithStats.filter(drive => drive && drive._id && drive.title);
    res.json(validDrives);
  } catch (error) {
    console.error('Error fetching user drives:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Approve/Decline Drive (Admin)
router.put('/:id/status', auth('admin'), async (req, res) => {
  const { status, comment } = req.body;

  if (!['approved', 'declined'].includes(status)) return res.status(400).json({ msg: 'Invalid status' });

  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ msg: 'Drive not found' });

    drive.status = status;
    drive.adminComment = comment || '';
    await drive.save();

    // Notify the creator
    const creatorNotification = new Notification({
      user: drive.creator,
      message: `Your drive "${drive.title}" has been ${status}.${comment ? ` Comment: ${comment}` : ''}`,
      type: 'approval',
    });
    await creatorNotification.save();

    // Notify other admins (excluding the current admin)
    const admins = await User.find({ role: 'admin', _id: { $ne: req.user.id } }).select('_id');
    const adminNotifications = admins.map((admin) => ({
      user: admin._id,
      message: `Drive "${drive.title}" has been ${status} by another admin.${comment ? ` Comment: ${comment}` : ''}`,
      type: 'approval',
    }));
    await Notification.insertMany(adminNotifications);

    const io = req.app.get('io');
    if (io) {
      io.to(drive.creator.toString()).emit('notification', creatorNotification);
      adminNotifications.forEach((notification) => {
        io.to(notification.user.toString()).emit('notification', notification);
      });
    }

    res.json(drive);
  } catch (error) {
    console.error('Error updating drive status:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Drive (Beneficiary)
router.put('/:id', auth('beneficiary'), async (req, res) => {
  const { title, description, images, itemsNeeded, monetaryGoal, location, startDate, endDate } = req.body;

  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive || drive.creator.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    Object.assign(drive, {
      title: title || drive.title,
      description: description || drive.description,
      images: images || drive.images,
      itemsNeeded: itemsNeeded || drive.itemsNeeded,
      monetaryGoal: monetaryGoal !== undefined ? monetaryGoal : drive.monetaryGoal,
      location: location || drive.location,
      startDate: startDate || drive.startDate,
      endDate: endDate || drive.endDate,
      status: 'pending',
    });

    await drive.save();

    // Notify the creator
    const creatorNotification = new Notification({
      user: req.user.id,
      message: `Your drive "${drive.title}" has been updated and is pending approval.`,
      type: 'drive',
    });
    await creatorNotification.save();

    // Notify admins
    const admins = await User.find({ role: 'admin' }).select('_id');
    const adminNotifications = admins.map((admin) => ({
      user: admin._id,
      message: `Drive "${drive.title}" has been updated and is pending approval.`,
      type: 'drive',
    }));
    await Notification.insertMany(adminNotifications);

    const io = req.app.get('io');
    if (io) {
      io.to(req.user.id.toString()).emit('notification', creatorNotification);
      adminNotifications.forEach((notification) => {
        io.to(notification.user.toString()).emit('notification', notification);
      });
    }

    res.json(drive);
  } catch (error) {
    console.error('Error updating drive:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete Drive (Admin or Beneficiary)
router.delete('/:id', auth(['admin', 'beneficiary']), async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive || (drive.creator.toString() !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await drive.deleteOne();

    // Notify the creator
    const creatorNotification = new Notification({
      user: drive.creator,
      message: `Your drive "${drive.title}" has been deleted.`,
      type: 'drive',
    });
    await creatorNotification.save();

    // Notify other admins if an admin deleted the drive
    let adminNotifications = [];
    if (req.user.role === 'admin') {
      const admins = await User.find({ role: 'admin', _id: { $ne: req.user.id } }).select('_id');
      adminNotifications = admins.map((admin) => ({
        user: admin._id,
        message: `Drive "${drive.title}" has been deleted by another admin.`,
        type: 'drive',
      }));
      await Notification.insertMany(adminNotifications);
    }

    const io = req.app.get('io');
    if (io) {
      io.to(drive.creator.toString()).emit('notification', creatorNotification);
      adminNotifications.forEach((notification) => {
        io.to(notification.user.toString()).emit('notification', notification);
      });
    }

    res.json({ msg: 'Drive deleted' });
  } catch (error) {
    console.error('Error deleting drive:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add Drive Update (Beneficiary)
router.post('/:id/updates', auth('beneficiary'), async (req, res) => {
  const { text, image } = req.body;

  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive || drive.creator.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    drive.updates = drive.updates || [];
    drive.updates.push({ text, image });
    await drive.save();

    // Notify the creator
    const creatorNotification = new Notification({
      user: req.user.id,
      message: `New update added to your drive "${drive.title}".`,
      type: 'drive',
    });
    await creatorNotification.save();

    // Notify donors
    const donations = await Donation.find({ drive: req.params.id }).distinct('donor');
    const donorNotifications = donations.map((donorId) => ({
      user: donorId,
      message: `New update for drive "${drive.title}": ${text}`,
      type: 'drive',
    }));
    await Notification.insertMany(donorNotifications);

    const io = req.app.get('io');
    if (io) {
      io.to(req.user.id.toString()).emit('notification', creatorNotification);
      donorNotifications.forEach((notification) => {
        io.to(notification.user.toString()).emit('notification', notification);
      });
    }

    res.json(drive);
  } catch (error) {
    console.error('Error adding drive update:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Donate to Drive (Donor)
router.post('/:id/donate', auth(), async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || !paymentMethod) return res.status(400).json({ msg: 'Amount and payment method are required' });

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return res.status(400).json({ msg: 'Invalid amount' });

    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ msg: 'Drive not found' });

    if (drive.status !== 'approved') return res.status(400).json({ msg: 'Drive is not approved for donations' });

    drive.raisedAmount = (drive.raisedAmount || 0) + parsedAmount;
    drive.backers = (drive.backers || 0) + 1;

    const donation = new Donation({
      donor: req.user.id,
      drive: drive._id,
      amount: parsedAmount,
      paymentMethod,
      date: new Date(),
    });
    await donation.save();

    await drive.save();

    // Notify the creator
    const creatorNotification = new Notification({
      user: drive.creator,
      message: `You received a donation of ₹${parsedAmount} for "${drive.title}".`,
      type: 'donation',
    });
    await creatorNotification.save();

    // Notify the donor
    const donorNotification = new Notification({
      user: req.user.id,
      message: `Your donation of ₹${parsedAmount} to "${drive.title}" was successful.`,
      type: 'donation',
    });
    await donorNotification.save();

    // Notify admins if the donation is significant (e.g., ≥ ₹10,000)
    let adminNotifications = [];
    if (parsedAmount >= 10000) {
      const admins = await User.find({ role: 'admin' }).select('_id');
      adminNotifications = admins.map((admin) => ({
        user: admin._id,
        message: `A significant donation of ₹${parsedAmount} was made to "${drive.title}".`,
        type: 'donation',
      }));
      await Notification.insertMany(adminNotifications);
    }

    const io = req.app.get('io');
    if (io) {
      io.to(drive.creator.toString()).emit('notification', creatorNotification);
      io.to(req.user.id.toString()).emit('notification', donorNotification);
      adminNotifications.forEach((notification) => {
        io.to(notification.user.toString()).emit('notification', notification);
      });
    }

    res.json(drive);
  } catch (error) {
    console.error('Error processing donation:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;