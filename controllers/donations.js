const Donation = require('../models/Donation');
const Drive = require('../models/Drive');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { donationsTotal } = require('../middleware/metrics');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance safely (fallback to dev keys if env is missing)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_fallbackKey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'fallbackSecret456xyz'
});

exports.createDonation = asyncHandler(async (req, res, next) => {
  const { drive, type, amount, items, paymentMethod } = req.body;

  const driveDoc = await Drive.findById(drive);
  if (!driveDoc) {
    return next(new ErrorResponse(`Drive not found with id of ${drive}`, 404));
  }

  const donation = await Donation.create({
    drive,
    donor: req.user.id,
    type,
    amount: type === 'monetary' ? amount : undefined,
    items: type === 'item' ? items : undefined,
    paymentMethod: type === 'monetary' ? paymentMethod : 'N/A',
  });

  donationsTotal.inc({ type });

  driveDoc.donations.push(donation._id);
  await driveDoc.save();

  const notification = await Notification.create({
    user: driveDoc.creator,
    message: `New donation of ${type === 'monetary' ? '₹' + amount : 'items'} to your drive "${driveDoc.title}"`,
    type: 'donation',
  });

  const io = req.app.get('io');
  if (io) {
    io.to(driveDoc.creator.toString()).emit('notification', notification);
  }

  res.status(201).json({ success: true, data: donation });
});

exports.createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || amount < 1) {
    return next(new ErrorResponse('Please provide a valid amount', 400));
  }

  const options = {
    amount: amount * 100, // Razorpay works in paise
    currency: 'INR',
    receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    return next(new ErrorResponse('Failed to generate secure Razorpay order', 500));
  }
});

exports.verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, drive, amount } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'fallbackSecret456xyz')
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    return next(new ErrorResponse('Invalid payment signature. Transaction blocked.', 400));
  }

  const driveDoc = await Drive.findById(drive);
  if (!driveDoc) return next(new ErrorResponse('Drive not found', 404));

  // Save the secure transaction
  const donation = await Donation.create({
    drive,
    donor: req.user.id,
    type: 'monetary',
    amount: amount,
    paymentMethod: 'Razorpay',
    transactionId: razorpay_payment_id,
    orderId: razorpay_order_id,
    status: 'completed',
  });

  donationsTotal.inc({ type: 'monetary' });

  driveDoc.donations.push(donation._id);
  driveDoc.amountRaised += amount;
  await driveDoc.save();

  // Alert Beneficiary
  const notification = await Notification.create({
    user: driveDoc.creator,
    message: `Payment Received! ₹${amount} was securely transferred via Razorpay for "${driveDoc.title}"`,
    type: 'donation',
  });

  const io = req.app.get('io');
  if (io) io.to(driveDoc.creator.toString()).emit('notification', notification);

  res.status(200).json({ success: true, verified: true, data: donation });
});

exports.confirmDonation = asyncHandler(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id).populate('drive');

  if (!donation) {
    return next(new ErrorResponse(`Donation not found with id of ${req.params.id}`, 404));
  }

  if (donation.drive.creator.toString() !== req.user.id) {
    return next(new ErrorResponse(`User not authorized to confirm this donation`, 403));
  }

  donation.status = 'delivered';
  await donation.save();

  const notification = await Notification.create({
    user: donation.donor,
    message: `Your donation to "${donation.drive.title}" has been confirmed as delivered.`,
    type: 'donation',
  });

  const io = req.app.get('io');
  if (io) {
    io.to(donation.donor.toString()).emit('notification', notification);
  }

  res.status(200).json({ success: true, data: donation });
});

exports.getMyDonations = asyncHandler(async (req, res, next) => {
  const donations = await Donation.find({ donor: req.user.id })
    .populate('drive', 'title')
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: donations.length,
    data: donations,
  });
});

exports.getDriveDonations = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.driveId);

  if (!drive) {
    return next(new ErrorResponse(`Drive not found with id of ${req.params.driveId}`, 404));
  }

  if (req.user.role !== 'admin' && drive.creator.toString() !== req.user.id) {
    return next(new ErrorResponse(`User not authorized to access these donations`, 403));
  }

  const donations = await Donation.find({ drive: req.params.driveId })
    .populate('donor', 'name email')
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: donations.length,
    data: donations,
  });
});

exports.getDonations = asyncHandler(async (req, res, next) => {
  const donations = await Donation.find()
    .populate('drive', 'title')
    .populate('donor', 'name email');

  res.status(200).json({
    success: true,
    count: donations.length,
    data: donations,
  });
});
