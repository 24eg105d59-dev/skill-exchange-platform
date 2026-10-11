import express from 'express';
import { Requests, Sessions, Users } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { createNotification } from '../utils/notify.js';

const router = express.Router();

// Get incoming and outgoing requests
router.get('/', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const incoming = Requests.find(r => r.receiverId === userId);
    const outgoing = Requests.find(r => r.senderId === userId);

    // Hydrate with user profiles
    const hydrate = (list) => list.map(reqItem => {
      const sender = Users.findById(reqItem.senderId);
      const receiver = Users.findById(reqItem.receiverId);

      const senderSafe = sender ? { _id: sender._id, name: sender.name, email: sender.email, avatarUrl: sender.avatarUrl, trustScore: sender.trustScore } : null;
      const receiverSafe = receiver ? { _id: receiver._id, name: receiver.name, email: receiver.email, avatarUrl: receiver.avatarUrl, trustScore: receiver.trustScore } : null;

      return {
        ...reqItem,
        sender: senderSafe,
        receiver: receiverSafe
      };
    });

    res.json({
      incoming: hydrate(incoming),
      outgoing: hydrate(outgoing)
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving learning requests' });
  }
});

// Send new request
router.post('/', authMiddleware, (req, res) => {
  try {
    const { receiverId, requestedSkill, offeredSkill, message, proposedDate } = req.body;
    if (!receiverId || !requestedSkill) {
      return res.status(400).json({ message: 'Receiver ID and requested skill are required' });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'You cannot send a learning request to yourself' });
    }

    const receiver = Users.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Target student not found' });
    }

    const newRequest = Requests.create({
      senderId: req.user.id,
      receiverId,
      requestedSkill,
      offeredSkill: offeredSkill || 'Open to reciprocate',
      message: message || `Hi! I would love to connect and exchange knowledge regarding ${requestedSkill}.`,
      proposedDate: proposedDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'pending'
    });

    // Notify receiver
    createNotification({
      userId: receiverId,
      title: 'New Skill Exchange Request!',
      message: `${req.user.name} sent you a request to learn ${requestedSkill}.`,
      type: 'request',
      link: '/requests'
    });

    res.status(201).json({
      message: 'Learning request sent successfully!',
      request: newRequest
    });
  } catch (err) {
    console.error('Send request error:', err);
    res.status(500).json({ message: 'Error sending request' });
  }
});

// Respond to request (accept / decline)
router.patch('/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either accepted or declined' });
    }

    const existing = Requests.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (existing.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Only the recipient can respond to this request' });
    }

    const updated = Requests.findByIdAndUpdate(req.params.id, { status });

    // If accepted, schedule the session automatically
    let createdSession = null;
    if (status === 'accepted') {
      const roomSlug = 'skill-swap-' + Math.random().toString(36).substring(2, 8);
      createdSession = Sessions.create({
        requestId: existing._id,
        mentorId: existing.receiverId,
        learnerId: existing.senderId,
        skillName: existing.requestedSkill,
        reciprocalSkill: existing.offeredSkill,
        scheduledStartTime: existing.proposedDate || new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 60,
        meetingUrl: `https://meet.jit.si/${roomSlug}`,
        status: 'scheduled',
        mentorConfirmed: false,
        learnerConfirmed: false
      });

      createNotification({
        userId: existing.senderId,
        title: 'Skill Request Accepted! 🎉',
        message: `${req.user.name} accepted your request to learn ${existing.requestedSkill}. Your session has been scheduled!`,
        type: 'session',
        link: '/sessions'
      });
    } else {
      createNotification({
        userId: existing.senderId,
        title: 'Skill Request Update',
        message: `${req.user.name} declined your exchange request for ${existing.requestedSkill}.`,
        type: 'info',
        link: '/requests'
      });
    }

    res.json({
      message: `Request ${status} successfully`,
      request: updated,
      session: createdSession
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating request status' });
  }
});

export default router;
