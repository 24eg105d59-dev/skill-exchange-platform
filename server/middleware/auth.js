import jwt from 'jsonwebtoken';
import { Users } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'skill_exchange_p2p_secret_key_2026_xyz';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = Users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }
    if (user.isSuspended) {
      return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
    }
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'student'
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const adminGuard = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Administrator privileges required.' });
  }
  next();
};
