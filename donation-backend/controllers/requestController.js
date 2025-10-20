// controllers/donationRequestController.js
import { db, bucket, admin } from "../config/firebase.js";

const uploadFileToFirebase = async (file) => {
  if (!file) return null;
  const fileName = `${Date.now()}_${file.originalname}`;
  const fileRef = bucket.file(fileName);
  await fileRef.save(file.buffer, {
    metadata: { contentType: file.mimetype },
    public: true,
  });
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
};

export const saveDonationRequest = async (req, res) => {
  try {
    const { fullName, nic, address, contactNumber, itemType, quantity, reason, description } = req.body;
    if (!fullName || !nic || !address || !contactNumber || !itemType || !quantity || !reason) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

    const medicalUrl = await uploadFileToFirebase(req.files?.medicalReport?.[0]);
    const policeUrl = await uploadFileToFirebase(req.files?.policeReport?.[0]);
    const gramaSevakaUrl = await uploadFileToFirebase(req.files?.gramaSevakaReport?.[0]);

    const docRef = await db.collection("donationRequests").add({
      fullName,
      nic,
      address,
      contactNumber,
      itemType,
      quantity,
      reason,
      description: description || null,
      medicalReport: medicalUrl || null,
      policeReport: policeUrl || null,
      gramaSevakaReport: gramaSevakaUrl || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Donation request submitted successfully!", id: docRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit donation request." });
  }
};
