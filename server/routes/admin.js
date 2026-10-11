import express from 'express';
import { Users, Sessions, Requests, Reviews, Reports } from '../config/db.js';
import { authMiddleware, adminGuard } from '../middleware/auth.js';

const router = express.Router();

// Public/student endpoint to file a report
router.post('/report', authMiddleware, (req, res) => {
  try {
    const { targetUserId, sessionId, reason, details } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'Reason for report is required' });
    }

    const newReport = Reports.create({
      reporterId: req.user.id,
      reporterName: req.user.name,
      targetUserId,
      sessionId,
      reason,
      details: details || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Report submitted for administrator review', report: newReport });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting report' });
  }
});

// Admin stats
router.get('/stats', authMiddleware, adminGuard, (req, res) => {
  try {
    const allUsers = Users.find();
    const allSessions = Sessions.find();
    const allRequests = Requests.find();
    const allReviews = Reviews.find();
    const allReports = Reports.find();

    const completedSessions = allSessions.filter(s => s.status === 'completed');
    const totalHours = completedSessions.reduce((acc, s) => acc + (s.durationMinutes || 60) / 60, 0);

    // Compute popular skills
    const skillCount = {};
    allUsers.forEach(u => {
      (u.offeredSkills || []).forEach(s => {
        const name = typeof s === 'string' ? s : s.name;
        if (name) skillCount[name] = (skillCount[name] || 0) + 1;
      });
    });

    const popularSkills = Object.entries(skillCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.json({
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => !u.isSuspended).length,
      totalSessions: allSessions.length,
      completedSessions: completedSessions.length,
      totalHoursExchanged: Math.round(totalHours * 10) / 10,
      totalRequests: allRequests.length,
      totalReviews: allReviews.length,
      pendingReports: allReports.filter(r => r.status === 'pending').length,
      popularSkills
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving platform statistics' });
  }
});

// Admin list users
router.get('/users', authMiddleware, adminGuard, (req, res) => {
  try {
    const users = Users.find().map(u => {
      const safe = { ...u };
      delete safe.passwordHash;
      return safe;
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user list' });
  }
});

// Admin toggle user suspension status
router.patch('/users/:id/status', authMiddleware, adminGuard, (req, res) => {
  try {
    const user = Users.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newSuspendedState = !user.isSuspended;
    const updated = Users.findByIdAndUpdate(req.params.id, { isSuspended: newSuspendedState });

    res.json({
      message: `User ${newSuspendedState ? 'suspended' : 're-activated'} successfully`,
      user: updated
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Admin get reports
router.get('/reports', authMiddleware, adminGuard, (req, res) => {
  try {
    const reports = Reports.find();
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Admin resolve report
router.patch('/reports/:id/resolve', authMiddleware, adminGuard, (req, res) => {
  try {
    const updated = Reports.findByIdAndUpdate(req.params.id, { status: 'resolved' });
    res.json({ message: 'Report marked as resolved', report: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error resolving report' });
  }
});

export default router;
