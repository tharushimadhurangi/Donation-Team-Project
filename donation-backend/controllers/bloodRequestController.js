import { db } from "../config/firebase.js";

// Create blood request
export const createBloodRequest = async (req, res) => {
  try {
    const { fullName, bloodGroup, reason, nic, contactNumber, description, location } = req.body;

    if (!fullName || !bloodGroup || !reason || !nic || !contactNumber || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const docRef = await db.collection("bloodRequests").add({
      fullName,
      bloodGroup,
      reason,
      nic,
      contactNumber,
      description: description || "",
      location,
      status: "pending",
      timestamp: new Date(),
    });

    res.status(201).json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("Create Blood Request Error:", err);
    res.status(500).json({ error: "Failed to submit blood request" });
  }
};

// Get all blood requests
export const getAllBloodRequests = async (req, res) => {
  try {
    const snapshot = await db.collection("bloodRequests").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blood requests" });
  }
};

// Approve a blood request
export const approveBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("bloodRequests").doc(id).update({ status: "approved" });
    res.json({ message: "Request approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve request" });
  }
};

// Reject a blood request
export const rejectBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("bloodRequests").doc(id).update({ status: "rejected" });
    res.json({ message: "Request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject request" });
  }
};
