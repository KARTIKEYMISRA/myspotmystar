const jwt = require('jsonwebtoken');

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// Role-based middleware
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        requiredRole: roles,
        yourRole: req.user.role
      });
    }
    
    next();
  };
};

// Specific role middlewares
const requireUser = requireRole('user');
const requireArtist = requireRole('artist');
const requireBrand = requireRole('brand');
const requireAdmin = requireRole('admin');

// Allow multiple roles
const requireUserOrAdmin = requireRole('user', 'admin');
const requireArtistOrAdmin = requireRole('artist', 'admin');

module.exports = {
  verifyToken,
  requireRole,
  requireUser,
  requireArtist,
  requireBrand,
  requireAdmin,
  requireUserOrAdmin,
  requireArtistOrAdmin
};
