const express = require('express');
const {
  getDonations,
  getDriveDonations,
  getMyDonations,
  createDonation,
  confirmDonation,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/donations');

const router = express.Router();

const auth = require('../middleware/auth');

router.use(auth); // Protect all donation routes

router.route('/')
  .get(auth('admin'), getDonations)
  .post(auth('donor'), createDonation);

router.get('/my-donations', auth('donor'), getMyDonations);
router.get('/drive/:driveId', auth(['beneficiary', 'admin']), getDriveDonations);
router.put('/:id/confirm', auth('beneficiary'), confirmDonation);

// Razorpay Transaction Routes
router.post('/razorpay/order', auth('donor'), createRazorpayOrder);
router.post('/razorpay/verify', auth('donor'), verifyRazorpayPayment);

module.exports = router;

module.exports = router;