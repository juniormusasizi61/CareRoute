const jwt = require('jsonwebtoken');
const { User } = require('../db');

// Middleware to validate JWT bearer tokens and attach the authenticated user.
const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    const user = await User.findByPk(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Keep only the public user fields needed by downstream handlers.
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  } catch (err) {
    console.warn('Authentication failed:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  authenticate,
};
