// routes/userRoutes.js
import express from "express";
import { getUser, updateUser } from "../controllers/userController.js";
const router = express.Router();

router.get("/:uid", getUser);
router.put("/:uid", updateUser);

export default router;
