const Drive = require('../models/Drive');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getDrives = asyncHandler(async (req, res, next) => {
  const drives = await Drive.find({ status: 'approved' })
    .populate('creator', 'name')
    .populate('donations')
    .lean();

  const drivesWithStats = await Promise.all(
    drives.map(async (drive) => {
      const donations = await Donation.find({ drive: drive._id });
      const raisedAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
      const backers = [...new Set(donations.map((d) => d.donor.toString()))].length;
      return { ...drive, raisedAmount, backers };
    })
  );

  res.status(200).json({
    success: true,
    count: drivesWithStats.length,
    data: drivesWithStats.filter((d) => d && d._id),
  });
});

exports.createDrive = asyncHandler(async (req, res, next) => {
  const {
    title, category, description, beneficiaryName, coverImage, images, 
    videoUrl, contactNumber, alternateNumber, documentLinks, monetaryGoal,
    isTaxBenefitAvailable, urgency, itemsNeeded, location, city, state, 
    pincode, locationCoordinates, startDate, endDate
  } = req.body;

  const drive = await Drive.create({
    title, category, description, beneficiaryName, coverImage, images,
    videoUrl, contactNumber, alternateNumber, documentLinks, monetaryGoal,
    isTaxBenefitAvailable, urgency, itemsNeeded, location, city, state,
    pincode, locationCoordinates, startDate, endDate,
    creator: req.user.id,
    status: 'pending'
  });

  const creatorNotification = await Notification.create({
    user: req.user.id,
    message: `Your drive "${drive.title}" has been submitted for approval.`,
    type: 'drive',
  });

  const admins = await User.find({ role: 'admin' }).select('_id');
  const adminNotifications = admins.map((admin) => ({
    user: admin._id,
    message: `A new drive "${drive.title}" has been submitted for approval.`,
    type: 'drive',
  }));
  await Notification.insertMany(adminNotifications);

  const io = req.app.get('io');
  if (io) {
    io.to(req.user.id.toString()).emit('notification', creatorNotification);
    adminNotifications.forEach((n) => io.to(n.user.toString()).emit('notification', n));
  }

  res.status(201).json({
    success: true,
    data: drive,
  });
});

exports.getMyDrives = asyncHandler(async (req, res, next) => {
  const drives = await (req.user.role === 'admin' ? Drive.find() : Drive.find({ creator: req.user.id }))
    .populate('creator', 'name')
    .populate('donations')
    .lean();

  const drivesWithStats = await Promise.all(
    drives.map(async (drive) => {
      const donations = await Donation.find({ drive: drive._id });
      const raisedAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
      const backers = [...new Set(donations.map((d) => d.donor.toString()))].length;
      return { ...drive, raisedAmount, backers };
    })
  );

  res.status(200).json({
    success: true,
    count: drivesWithStats.length,
    data: drivesWithStats,
  });
});

exports.updateDriveStatus = asyncHandler(async (req, res, next) => {
  const { status, comment } = req.body;

  let drive = await Drive.findById(req.params.id);
  if (!drive) {
    return next(new ErrorResponse(`Drive not found with id of ${req.params.id}`, 404));
  }

  drive = await Drive.findByIdAndUpdate(
    req.params.id,
    { status, adminComment: comment || '' },
    { new: true, runValidators: true }
  );

  const creatorNotification = await Notification.create({
    user: drive.creator,
    message: `Your drive "${drive.title}" has been ${status}.${comment ? ` Comment: ${comment}` : ''}`,
    type: 'approval',
  });

  const io = req.app.get('io');
  if (io) {
    io.to(drive.creator.toString()).emit('notification', creatorNotification);
  }

  res.status(200).json({
    success: true,
    data: drive,
  });
});

exports.updateDrive = asyncHandler(async (req, res, next) => {
  let drive = await Drive.findById(req.params.id);

  if (!drive) {
    return next(new ErrorResponse(`Drive not found with id of ${req.params.id}`, 404));
  }

  if (drive.creator.toString() !== req.user.id) {
    return next(new ErrorResponse(`User not authorized to update this drive`, 403));
  }

  // Smart Re-approval Logic: Identify changes to critical fields
  const criticalFields = [
    'title', 'category', 'beneficiaryName', 'monetaryGoal', 
    'contactNumber', 'documentLinks', 'location', 'city', 
    'state', 'pincode', 'isTaxBenefitAvailable', 'startDate', 'endDate'
  ];

  let requiresReapproval = false;
  criticalFields.forEach(field => {
    if (req.body[field] !== undefined) {
      const newVal = JSON.stringify(req.body[field]);
      const oldVal = JSON.stringify(drive[field]);
      if (newVal !== oldVal) {
        requiresReapproval = true;
      }
    }
  });

  if (requiresReapproval && drive.status === 'approved') {
    req.body.status = 'pending';
    
    // Create notification for re-approval
    await Notification.create({
      user: req.user.id,
      message: `Your campaign "${drive.title}" is being re-audited because you modified critical verification fields.`,
      type: 'drive'
    });
  }

  drive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: drive,
    notif: requiresReapproval ? 'Your campaign is being re-verified.' : 'Changes updated successfully.'
  });
});

exports.deleteDrive = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    return next(new ErrorResponse(`Drive not found with id of ${req.params.id}`, 404));
  }

  if (drive.creator.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User not authorized to delete this drive`, 403));
  }

  await drive.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getDrive = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.id)
    .populate('creator', 'name profileImage')
    .populate('donations')
    .lean();

  if (!drive) {
    return next(new ErrorResponse(`Drive not found with id of ${req.params.id}`, 404));
  }

  // Calculate raised amount
  const donations = await Donation.find({ drive: drive._id });
  const raisedAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const backers = [...new Set(donations.map((d) => d.donor.toString()))].length;

  res.status(200).json({
    success: true,
    data: { ...drive, raisedAmount, backers }
  });
});

exports.addDriveUpdate = asyncHandler(async (req, res, next) => {
  const { text, image } = req.body;

  const drive = await Drive.findById(req.params.id);
  if (!drive) {
    return next(new ErrorResponse(`Drive not found with id of ${req.params.id}`, 404));
  }

  if (drive.creator.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 403));
  }

  drive.updates.push({ text, image });
  await drive.save();

  const donations = await Donation.find({ drive: req.params.id }).distinct('donor');
  const donorNotifications = donations.map((donorId) => ({
    user: donorId,
    message: `New update for drive "${drive.title}": ${text}`,
    type: 'drive',
  }));
  await Notification.insertMany(donorNotifications);

  res.status(200).json({
    success: true,
    data: drive,
  });
});
