const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is notification owner
  if (notification.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 403));
  }

  notification.read = true;
  await notification.save();

  const io = req.app.get('io');
  if (io) {
    io.to(req.user.id.toString()).emit('notification', notification);
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
});
