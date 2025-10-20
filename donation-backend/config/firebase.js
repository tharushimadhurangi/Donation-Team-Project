// config/firebase.js
import admin from "firebase-admin";
import fs from "fs";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || "./serviceAccountKey.json";

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ Missing Firebase serviceAccountKey.json file!");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "donation-project-59689.appspot.com", // <-- add your bucket name
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const bucket = admin.storage().bucket(); // <-- export Storage bucket

console.log("🔥 Connected to Firebase:", serviceAccount.project_id);
