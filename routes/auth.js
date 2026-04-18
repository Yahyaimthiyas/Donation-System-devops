const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Register User
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['donor', 'beneficiary', 'admin']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors during registration:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    console.log('Register request:', { name, email, role });

    try {
      const normalizedEmail = email.toLowerCase();
      let user = await User.findOne({ email: normalizedEmail });
      if (user) {
        console.log('User already exists:', normalizedEmail);
        return res.status(400).json({ msg: 'Email is already in use' });
      }

      user = new User({
        name,
        email: normalizedEmail,
        password,
        role,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      console.log('Password hashed for user:', normalizedEmail);

      await user.save();
      console.log('User saved successfully:', user._id);

      const payload = {
        user: {
          id: user._id,
          role: user.role,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generated for user:', normalizedEmail);
      res.json({ token });
    } catch (error) {
      console.error('Error registering user:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      res.status(500).json({ msg: `Server error during registration: ${error.message}` });
    }
  }
);

// Login User
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors during login:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login request:', { email });

    try {
      const normalizedEmail = email.toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        console.log('User not found:', normalizedEmail);
        return res.status(400).json({ msg: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch for user:', normalizedEmail);
        return res.status(400).json({ msg: 'Incorrect password' });
      }

      const payload = {
        user: {
          id: user._id,
          role: user.role,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generated for user:', normalizedEmail);
      res.json({ token });
    } catch (error) {
      console.error('Error logging in user:', {
        message: error.message,
        stack: error.stack,
      });
      res.status(500).json({ msg: `Server error during login: ${error.message}` });
    }
  }
);

// Get Authenticated User
router.get('/me', auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;