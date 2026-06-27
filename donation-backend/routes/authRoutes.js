import express from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
  getUser,
  updateUser,
} from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);

// Profile routes
router.get("/:uid", getUser);
router.put("/:uid", updateUser);

export default router;
