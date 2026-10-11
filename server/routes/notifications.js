import express from 'express';
import { Notifications } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const list = Notifications.find(n => n.userId === req.user.id);
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving notifications' });
  }
});

router.patch('/:id/read', authMiddleware, (req, res) => {
  try {
    const notif = Notifications.findById(req.params.id);
    if (!notif || notif.userId !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    const updated = Notifications.findByIdAndUpdate(req.params.id, { read: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

router.patch('/read-all', authMiddleware, (req, res) => {
  try {
    const list = Notifications.find(n => n.userId === req.user.id && !n.read);
    for (const item of list) {
      Notifications.findByIdAndUpdate(item._id, { read: true });
    }
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notifications' });
  }
});

export default router;
