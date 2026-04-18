const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('x-auth-token');

      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      req.user = decoded.user;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
      }

      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
};

module.exports = auth;