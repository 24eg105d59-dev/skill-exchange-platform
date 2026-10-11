import express from 'express';
import { Reviews, Sessions, Users } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { createNotification } from '../utils/notify.js';

const router = express.Router();

// Post review for a session
router.post('/', authMiddleware, (req, res) => {
  try {
    const { sessionId, rating, comment, aspects } = req.body;
    if (!sessionId || !rating) {
      return res.status(400).json({ message: 'Session ID and rating (1-5) are required' });
    }

    const session = Sessions.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Determine reviewee
    const isMentor = session.mentorId === req.user.id;
    const isLearner = session.learnerId === req.user.id;

    if (!isMentor && !isLearner) {
      return res.status(403).json({ message: 'You were not a participant in this session' });
    }

    const revieweeId = isMentor ? session.learnerId : session.mentorId;

    // Check if already reviewed
    const existing = Reviews.findOne(r => r.sessionId === sessionId && r.reviewerId === req.user.id);
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this session' });
    }

    const numRating = Math.max(1, Math.min(5, Number(rating)));

    const newReview = Reviews.create({
      sessionId,
      reviewerId: req.user.id,
      reviewerName: req.user.name,
      revieweeId,
      skillName: session.skillName,
      rating: numRating,
      comment: comment || 'Great peer learning experience!',
      aspects: aspects || ['Knowledgeable', 'Patient', 'Punctual'],
      createdAt: new Date().toISOString()
    });

    // Update reviewee trust score and total reviews
    const allUserReviews = Reviews.find(r => r.revieweeId === revieweeId);
    const totalReviews = allUserReviews.length;
    const avgScore = allUserReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const roundedTrust = Math.round(avgScore * 10) / 10;

    Users.findByIdAndUpdate(revieweeId, {
      trustScore: roundedTrust,
      totalReviews
    });

    createNotification({
      userId: revieweeId,
      title: 'New Feedback Received! ⭐',
      message: `${req.user.name} rated your session with ${numRating} stars: "${comment ? comment.substring(0, 50) : ''}..."`,
      type: 'review',
      link: `/users/${revieweeId}`
    });

    res.status(201).json({
      message: 'Review submitted successfully!',
      review: newReview,
      updatedTrustScore: roundedTrust
    });
  } catch (err) {
    console.error('Review error:', err);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

// Get reviews for a user
router.get('/user/:userId', (req, res) => {
  try {
    const list = Reviews.find(r => r.revieweeId === req.params.userId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving reviews' });
  }
});

export default router;
