// backend/routes/donationRouter.js
import express from "express";
import {
  saveDonation,
  createOrder,
  captureOrder,
  createDonationRequest,
  getAllDonationRequests,
  updateDonationStatus,
} from "../controllers/donationController.js";

const router = express.Router();

router.post("/save-donation", saveDonation);       // 💰 Money donation
router.post("/create-order", createOrder);         // PayPal create order
router.post("/capture-order", captureOrder);       // PayPal capture
router.post("/", createDonationRequest);           // Physical donation request
router.get("/", getAllDonationRequests);           // Get all requests
router.put("/:id", updateDonationStatus);          // Approve/Reject request

export default router;
