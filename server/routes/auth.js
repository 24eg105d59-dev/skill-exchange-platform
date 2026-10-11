import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users, Skills } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'skill_exchange_p2p_secret_key_2026_xyz';

// Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role || 'student' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      university = 'University Student',
      bio = '',
      offeredSkills = [],
      desiredSkills = [],
      availability = {}
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = Users.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = Users.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      university,
      bio,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      offeredSkills: Array.isArray(offeredSkills) ? offeredSkills : [],
      desiredSkills: Array.isArray(desiredSkills) ? desiredSkills : [],
      availability: availability || {
        weekdays: ['Evening (6:00 PM - 8:00 PM)'],
        weekends: ['Morning (10:00 AM - 1:00 PM)']
      },
      hoursTaught: 0,
      hoursLearned: 0,
      trustScore: 5.0,
      totalReviews: 0,
      role: 'student',
      isSuspended: false,
      badges: ['New Explorer']
    });

    const token = generateToken(newUser);
    const userSafe = { ...newUser };
    delete userSafe.passwordHash;

    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = Users.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: 'This account has been suspended by administration.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const userSafe = { ...user };
    delete userSafe.passwordHash;

    res.json({
      message: 'Logged in successfully',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get Current User
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const userSafe = { ...user };
    delete userSafe.passwordHash;
    res.json(userSafe);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile.' });
  }
});

export default router;
