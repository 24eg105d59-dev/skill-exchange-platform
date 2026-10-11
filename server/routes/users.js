import express from 'express';
import { Users, Reviews, Sessions } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get public profile of a user
router.get('/:id', (req, res) => {
  try {
    const user = Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const userSafe = { ...user };
    delete userSafe.passwordHash;

    // Get user reviews
    const reviewsReceived = Reviews.find(r => r.revieweeId === user._id);
    const completedSessionsCount = Sessions.count(s =>
      (s.mentorId === user._id || s.learnerId === user._id) && s.status === 'completed'
    );

    res.json({
      ...userSafe,
      reviews: reviewsReceived,
      completedSessionsCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user profile.' });
  }
});

// Update current user profile
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const {
      name,
      university,
      bio,
      offeredSkills,
      desiredSkills,
      availability
    } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (university !== undefined) updates.university = university;
    if (bio !== undefined) updates.bio = bio;
    if (Array.isArray(offeredSkills)) updates.offeredSkills = offeredSkills;
    if (Array.isArray(desiredSkills)) updates.desiredSkills = desiredSkills;
    if (availability) updates.availability = availability;

    const updatedUser = Users.findByIdAndUpdate(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userSafe = { ...updatedUser };
    delete userSafe.passwordHash;

    res.json({
      message: 'Profile updated successfully',
      user: userSafe
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
});

// Learning progress & gamification metrics
router.get('/progress/summary', authMiddleware, (req, res) => {
  try {
    const user = Users.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userSessions = Sessions.find(s => s.mentorId === user._id || s.learnerId === user._id);
    const completedSessions = userSessions.filter(s => s.status === 'completed');
    const taughtSessions = completedSessions.filter(s => s.mentorId === user._id);
    const learnedSessions = completedSessions.filter(s => s.learnerId === user._id);

    const hoursTaught = taughtSessions.reduce((acc, s) => acc + (s.durationMinutes || 60) / 60, 0);
    const hoursLearned = learnedSessions.reduce((acc, s) => acc + (s.durationMinutes || 60) / 60, 0);

    // Calculate dynamically earned badges
    const badges = ['Student Member'];
    if (completedSessions.length >= 1) badges.push('First Exchange');
    if (taughtSessions.length >= 3) badges.push('Knowledge Mentor');
    if (taughtSessions.length >= 10) badges.push('Master Educator');
    if (learnedSessions.length >= 5) badges.push('Avid Learner');
    if (taughtSessions.length > 0 && learnedSessions.length > 0) badges.push('Reciprocal Champion');
    if (user.trustScore >= 4.8 && (user.totalReviews || 0) >= 2) badges.push('5-Star Peer');

    // Milestones roadmap
    const milestones = [
      { id: 'm1', title: 'Complete your skill profile', completed: (user.offeredSkills?.length > 0 && user.desiredSkills?.length > 0) },
      { id: 'm2', title: 'Send your first exchange request', completed: userSessions.length > 0 },
      { id: 'm3', title: 'Complete first 1-on-1 session', completed: completedSessions.length >= 1 },
      { id: 'm4', title: 'Achieve 3+ hours taught', completed: hoursTaught >= 3 },
      { id: 'm5', title: 'Reach reciprocal balance (1:1 ratio)', completed: (hoursTaught > 0 && Math.abs(hoursTaught - hoursLearned) <= 1) }
    ];

    res.json({
      hoursTaught: Math.round(hoursTaught * 10) / 10,
      hoursLearned: Math.round(hoursLearned * 10) / 10,
      completedSessionsCount: completedSessions.length,
      taughtSessionsCount: taughtSessions.length,
      learnedSessionsCount: learnedSessions.length,
      trustScore: user.trustScore || 5.0,
      totalReviews: user.totalReviews || 0,
      badges,
      milestones
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving learning progress' });
  }
});

export default router;
