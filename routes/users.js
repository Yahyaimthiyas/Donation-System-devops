const express = require('express');
const { getUsers, getMe, updateUser } = require('../controllers/users');
const router = express.Router();
const auth = require('../middleware/auth');

router.use(auth()); // Protect all user routes

router.get('/', auth('admin'), getUsers);
router.get('/me', getMe);
router.put('/', updateUser);

module.exports = router;

module.exports = router;