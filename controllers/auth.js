const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (role === 'admin') {
    return next(new ErrorResponse('Registration as admin is restricted', 403));
  }

  const normalizedEmail = email.toLowerCase();
  
  let user = await User.findOne({ email: normalizedEmail });
  if (user) {
    return next(new ErrorResponse('Email is already in use', 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

const sendTokenResponse = (user, statusCode, res) => {
  const payload = {
    user: { id: user._id, role: user.role }
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });

  res.status(statusCode).json({
    success: true,
    token,
  });
};

