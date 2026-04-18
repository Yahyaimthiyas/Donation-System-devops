const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get User Notifications
router.get('/', auth(['donor', 'beneficiary', 'admin']), async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Mark Notification as Read
router.put('/:id/read', auth(['donor', 'beneficiary', 'admin']), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();

    const io = req.app.get('io');
    if (io) {
      io.to(req.user.id.toString()).emit('notification', notification);
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;