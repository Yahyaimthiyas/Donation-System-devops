const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      console.log('Auth middleware triggered...');
      const token = req.header('x-auth-token');
      console.log('Token received:', token ? token.substring(0, 20) + '...' : 'No token');

      if (!token) {
        console.log('No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      console.log('Token decoded:', decoded);

      req.user = decoded.user;

      if (roles.length && !roles.includes(req.user.role)) {
        console.log('Role not authorized:', req.user.role, 'Required:', roles);
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