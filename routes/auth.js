const express = require('express');
const { register, login, getMe } = require('../controllers/auth');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['donor', 'beneficiary', 'admin']),
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

router.get('/me', auth(), getMe);

module.exports = router;

module.exports = router;