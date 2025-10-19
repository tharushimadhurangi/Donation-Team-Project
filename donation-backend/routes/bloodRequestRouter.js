import express from "express";
import {
  getAllBloodRequests,
  createBloodRequest,
  approveBloodRequest,
  rejectBloodRequest,
} from "../controllers/bloodRequestController.js";

const router = express.Router();

// Create blood request
router.post("/requests", createBloodRequest);

// Get all blood requests
router.get("/requests", getAllBloodRequests);

// Approve/reject
router.put("/:id/approve", approveBloodRequest);
router.put("/:id/reject", rejectBloodRequest);

export default router;
