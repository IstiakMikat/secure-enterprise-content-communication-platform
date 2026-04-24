const Notification = require("../models/Notification");

class NotificationService {
  create(userId, title, message, type = "SYSTEM", severity = "INFO", meta = {}) {
    return Notification.create({ userId, title, message, type, severity, meta });
  }

  list(userId) {
    return Notification.find({ userId }).sort({ createdAt: -1 });
  }

  markRead(userId, notificationId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { readAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new NotificationService();

