const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notifications');
const router = express.Router();
const auth = require('../middleware/auth');

router.use(auth()); // Protect all notification routes

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;

module.exports = router;