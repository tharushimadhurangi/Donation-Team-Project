// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRouter.js";
import bloodRequestRouter from "./routes/bloodRequestRouter.js";
import adminRouters from "./routes/adminRouters.js";
dotenv.config();

const app = express();
app.use(cors());   
app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Test route
app.get("/", (req, res) => res.send("Donation backend running ✅"));

// ✅ API routes
app.use("/api/auth", authRoutes);
// 👈 Add this
app.use("/api/donations", donationRoutes);
app.use("/api/donation-requests", donationRoutes); 
app.use("/api/blood", bloodRequestRouter);
app.use("/api/auth/user", authRoutes);
app.use("/api/admin", adminRouters);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
