import express from "express";
import {
  getAllDonationRequests,
  getAllBloodRequests,
  getAllMoneyDonations,
  updateRequestStatus,
  getNotifications,
  markNotificationRead
} from "../controllers/adminController.js";

const router = express.Router();

// GET requests
router.get("/donations/requests", getAllDonationRequests);
router.get("/blood/requests", getAllBloodRequests);
router.get("/money/requests", getAllMoneyDonations);

// PUT request status
router.put("/requests/:id/status", updateRequestStatus);

// Notifications
router.get("/notifications/:userId", getNotifications);
router.put("/notifications/:id/read", markNotificationRead);

export default router;