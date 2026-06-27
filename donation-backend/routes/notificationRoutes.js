import express from "express";
import {
  getNotifications,
  markNotificationRead,
  sendNotification
} from "../controllers/notificationController.js";

const router = express.Router();

// User fetch notifications
router.get("/:userId", getNotifications);

// User mark notification read
router.put("/:id/read", markNotificationRead);

// Admin send notification
router.post("/send", sendNotification);

export default router;
