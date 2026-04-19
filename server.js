require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const seedAdmin = require('./utils/seeder');
const { metricsMiddleware, getMetrics } = require('./middleware/metrics');

const authRoutes = require('./routes/auth');
const driveRoutes = require('./routes/drives');
const donationRoutes = require('./routes/donations');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');
const leaderboardRoutes = require('./routes/leaderboard');
const reportRoutes = require('./routes/reports');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.set('io', io);

// Performance Monitoring (Prometheus)
app.use(metricsMiddleware);
app.get('/metrics', getMetrics);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Custom MongoDB Sanitization Middleware (Fixes Express 5 issue)
const mongoSanitize = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else if (obj[key] instanceof Object) {
          sanitize(obj[key]);
        }
      }
    }
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
};

app.use(mongoSanitize);
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

app.use(hpp());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    seedAdmin();
  })
  .catch(err => console.error('❌ Database Connection Error:', err.message));

app.use('/api/auth', authRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (userId) socket.join(userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`));
