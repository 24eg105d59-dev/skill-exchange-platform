import { Notifications } from '../config/db.js';

export const createNotification = ({ userId, title, message, type = 'info', link = '' }) => {
  try {
    return Notifications.create({
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};
