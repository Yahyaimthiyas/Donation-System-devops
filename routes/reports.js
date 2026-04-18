const express = require('express');
const { getDonationReport, getDriveReport, getPlatformStats } = require('../controllers/reports');
const router = express.Router();
const auth = require('../middleware/auth');

router.use(auth('admin')); // Protect all report routes for Admin only

router.get('/donations', getDonationReport);
router.get('/drives', getDriveReport);
router.get('/stats', getPlatformStats);

module.exports = router;

module.exports = router;