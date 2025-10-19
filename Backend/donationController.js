// backend/controllers/donationController.js
import { db } from "../config/firebase.js";
import admin from "firebase-admin";
import fetch from "node-fetch";
import { PAYPAL_CLIENT, PAYPAL_SECRET, PAYPAL_BASE } from "../config/paypal.js";

const safeJson = async (res) => {
  try { return await res.json(); } 
  catch { return null; }
};

// ------------------ Donation Requests ------------------
export const createDonationRequest = async (req, res) => {
  try {
    const { fullName, nic, address, contactNumber, itemType, quantity, reason, description } = req.body;
    if (!fullName || !nic || !address || !contactNumber || !itemType || !quantity || !reason)
      return res.status(400).json({ error: "Missing required fields" });

    const docRef = await db.collection("donation-requests").add({
      userName: fullName,
      nic,
      address,
      contactNumber,
      itemType,
      quantity,
      reason,
      description: description || "",
      status: "Pending",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "Donation request saved", id: docRef.id });
  } catch (err) {
    console.error("Create Donation Request Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const getAllDonationRequests = async (req, res) => {
  try {
    const snapshot = await db.collection("donation-requests").orderBy("timestamp", "desc").get();
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(requests);
  } catch (err) {
    console.error("Get All Donation Requests Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    await db.collection("donation-requests").doc(id).update({ status });
    res.json({ message: `Request ${status}` });
  } catch (err) {
    console.error("Update Donation Status Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ Money Donations ------------------
export const saveDonation = async (req, res) => {
  try {
    const data = req.body;
    if (!data.amount || !data.name) return res.status(400).json({ error: "Required fields missing" });

    const docRef = await db.collection("donations").add({
      ...data,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, donationId: docRef.id });
  } catch (err) {
    console.error("Save Donation Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });

  }
  
};
// Get all money donations
export const getAllDonations = async (req, res) => {
  try {
    const snapshot = await db
      .collection("money-donations")
      .orderBy("timestamp", "desc")
      .get();

    const donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

// ------------------ PayPal ------------------
export const createOrder = async (req, res) => {
  try {
    const { amount, donationId } = req.body;
    if (!amount || !donationId) return res.status(400).json({ error: "Amount and donationId required" });

    const authHeader = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString("base64");
    const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amount }, custom_id: donationId }],
      }),
    });

    const data = await safeJson(response);
    if (!data || !data.id) return res.status(500).json({ error: "Failed to create PayPal order" });
    res.json({ orderID: data.id });
  } catch (err) {
    console.error("Create PayPal Order Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const captureOrder = async (req, res) => {
  try {
    const { orderID, donationId } = req.body;
    if (!orderID || !donationId) return res.status(400).json({ error: "orderID and donationId required" });

    const authHeader = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString("base64");
    const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { Authorization: `Basic ${authHeader}`, "Content-Type": "application/json" },
    });

    const captureData = await safeJson(response);
    if (!captureData || captureData.status !== "COMPLETED") return res.status(400).json({ error: "Payment not completed" });

    await db.collection("donations").doc(donationId).update({
      status: "completed",
      paypalResponse: captureData,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const donationDoc = await db.collection("donations").doc(donationId).get();
    const donation = donationDoc.data();

    res.json({
      success: true,
      receipt: {
        donationId,
        donorName: donation.name,
        donorEmail: donation.email || "",
        amount: donation.amount,
        paypalOrderId: orderID,
        paymentDate: new Date().toLocaleString(),
      },
    });
  } catch (err) {
    console.error("Capture PayPal Payment Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};
