import express from 'express';
import { Sessions, Users, Reviews } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { createNotification } from '../utils/notify.js';

const router = express.Router();

// Get sessions for current user
router.get('/', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const userSessions = Sessions.find(s => s.mentorId === userId || s.learnerId === userId);

    const hydrated = userSessions.map(session => {
      const mentor = Users.findById(session.mentorId);
      const learner = Users.findById(session.learnerId);
      const reviews = Reviews.find(r => r.sessionId === session._id);

      const mentorSafe = mentor ? { _id: mentor._id, name: mentor.name, email: mentor.email, avatarUrl: mentor.avatarUrl } : null;
      const learnerSafe = learner ? { _id: learner._id, name: learner.name, email: learner.email, avatarUrl: learner.avatarUrl } : null;

      // Has current user reviewed this session?
      const userHasReviewed = reviews.some(r => r.reviewerId === userId);

      return {
        ...session,
        mentor: mentorSafe,
        learner: learnerSafe,
        userHasReviewed,
        reviews
      };
    });

    // Sort by scheduledStartTime descending
    hydrated.sort((a, b) => new Date(b.scheduledStartTime) - new Date(a.scheduledStartTime));

    res.json(hydrated);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving sessions' });
  }
});

// Mark session completed
router.patch('/:id/complete', authMiddleware, (req, res) => {
  try {
    const session = Sessions.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const isMentor = session.mentorId === req.user.id;
    const isLearner = session.learnerId === req.user.id;

    if (!isMentor && !isLearner) {
      return res.status(403).json({ message: 'Not authorized for this session' });
    }

    const updates = {};
    if (isMentor) updates.mentorConfirmed = true;
    if (isLearner) updates.learnerConfirmed = true;

    // If either or both confirm, let's mark it as completed so students can proceed with review and hours credit
    updates.status = 'completed';

    const updatedSession = Sessions.findByIdAndUpdate(req.params.id, updates);

    // Credit hours to mentor & learner
    const mentor = Users.findById(session.mentorId);
    const learner = Users.findById(session.learnerId);
    const durationHours = (session.durationMinutes || 60) / 60;

    if (mentor) {
      Users.findByIdAndUpdate(mentor._id, {
        hoursTaught: Math.round(((mentor.hoursTaught || 0) + durationHours) * 10) / 10
      });
    }

    if (learner) {
      Users.findByIdAndUpdate(learner._id, {
        hoursLearned: Math.round(((learner.hoursLearned || 0) + durationHours) * 10) / 10
      });
    }

    // Send notifications to leave feedback
    const otherUserId = isMentor ? session.learnerId : session.mentorId;
    createNotification({
      userId: otherUserId,
      title: 'Session Completed!',
      message: `Your learning session for ${session.skillName} has been marked complete. Please share feedback and rate your peer!`,
      type: 'review',
      link: '/sessions'
    });

    res.json({
      message: 'Session completed successfully! Hours have been credited.',
      session: updatedSession
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating session' });
  }
});

// Cancel session
router.patch('/:id/cancel', authMiddleware, (req, res) => {
  try {
    const session = Sessions.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.mentorId !== req.user.id && session.learnerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = Sessions.findByIdAndUpdate(req.params.id, { status: 'cancelled' });

    const otherUserId = session.mentorId === req.user.id ? session.learnerId : session.mentorId;
    createNotification({
      userId: otherUserId,
      title: 'Session Cancelled',
      message: `The scheduled session for ${session.skillName} was cancelled by ${req.user.name}.`,
      type: 'alert',
      link: '/sessions'
    });

    res.json({ message: 'Session cancelled', session: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling session' });
  }
});

export default router;
