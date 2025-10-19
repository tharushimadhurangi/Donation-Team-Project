import { db } from "../config/firebase.js";

// =========================
// GET ALL DONATION REQUESTS
// =========================
export const getAllDonationRequests = async (req, res) => {
  try {
    const snapshot = await db.collection("donation-requests").orderBy("timestamp", "desc").get();
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch donation requests" });
  }
};

// =========================
// GET ALL BLOOD REQUESTS
// =========================
export const getAllBloodRequests = async (req, res) => {
  try {
    const snapshot = await db.collection("bloodRequests").orderBy("timestamp", "desc").get();
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch blood requests" });
  }
};

// =========================
// GET ALL MONEY DONATIONS
// =========================
export const getAllMoneyDonations = async (req, res) => {
  try {
    const snapshot = await db.collection("donations").orderBy("createdAt", "desc").get();
    const donations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, donations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch money donations" });
  }
};

// =========================
// UPDATE REQUEST STATUS
// =========================
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { type } = req.query;

    if (!status) return res.status(400).json({ success: false, error: "Missing status" });
    if (!["Approved", "Rejected"].includes(status)) return res.status(400).json({ success: false, error: "Invalid status" });

    let collectionName;
    switch (type) {
      case "donation": collectionName = "donation-requests"; break;
      case "blood": collectionName = "bloodRequests"; break;
      case "money": collectionName = "donations"; break;
      default: return res.status(400).json({ success: false, error: "Invalid type" });
    }

    const requestRef = db.collection(collectionName).doc(id);
    const requestDoc = await requestRef.get();
    if (!requestDoc.exists) return res.status(404).json({ success: false, error: "Request not found" });

    const requestData = requestDoc.data();
    if (!requestData.userId) return res.status(400).json({ success: false, error: "User ID missing" });

    await requestRef.update({ status });

    // Create notification
    await db.collection("notifications").add({
      userId: requestData.userId,
      message: `Your ${type} request has been ${status}`,
      timestamp: new Date(),
      status: "unread",
    });

    res.json({ success: true, message: `${type} request ${status} and notification sent` });
  } catch (err) {
    console.error("Error updating request status:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// =========================
// GET NOTIFICATIONS
// =========================
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection("notifications")
      .where("userId", "==", userId)
      .orderBy("timestamp", "desc")
      .get();

    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch notifications" });
  }
};

// =========================
// MARK NOTIFICATION AS READ
// =========================
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("notifications").doc(id).update({ status: "read" });
    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to mark notification as read" });
  }
};