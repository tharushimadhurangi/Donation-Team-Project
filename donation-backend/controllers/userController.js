
import admin from "../config/firebase.js";
const usersCollection = admin.firestore().collection("users");

export const getUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const doc = await usersCollection.doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: "User not found" });
    const data = doc.data();
    const { password, ...userSafe } = data;
    return res.json(userSafe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, phone } = req.body;
    if (!name && !phone) return res.status(400).json({ error: "Nothing to update" });

    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    await usersCollection.doc(uid).update(updates);
    return res.json({ message: "User updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
