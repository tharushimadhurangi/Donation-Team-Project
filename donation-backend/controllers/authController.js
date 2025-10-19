import { auth, db } from "../config/firebase.js";
import admin from "firebase-admin";


// REGISTER USER

export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
    return res.status(400).json({ error: "All fields are required" });

  try {
    
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

  
    const userData = {
      name,
      email,
      phone,
      role: "user",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    res.status(201).json({ uid: userRecord.uid, ...userData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// LOGIN USER

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
   
    const userRecord = await auth.getUserByEmail(email);
    const userDoc = await db.collection("users").doc(userRecord.uid).get();

    if (!userDoc.exists)
      return res.status(404).json({ error: "User data not found" });

    const userData = userDoc.data();
    res.status(200).json({
      uid: userRecord.uid,
      name: userRecord.displayName,
      email: userRecord.email,
      role: userData.role,
      message: "Login successful",
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid login credentials" });
  }
};


// RESET PASSWORD

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res
      .status(400)
      .json({ error: "Email and newPassword are required" });

  try {
    const user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password: newPassword });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GET USER PROFILE

export const getUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const doc = await db.collection("users").doc(uid).get();

    if (!doc.exists)
      return res.status(404).json({ error: "User not found" });

    const data = doc.data();

    const { password, ...userSafe } = data;
    return res.json(userSafe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// UPDATE USER PROFILE

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, phone } = req.body;

    if (!name && !phone)
      return res.status(400).json({ error: "Nothing to update" });

    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    await db.collection("users").doc(uid).update(updates);
    return res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
