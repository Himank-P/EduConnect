require('dotenv').config();
const admin = require('firebase-admin');

// 1. Extract and Sanitize
const key = process.env.FIREBASE_PRIVATE_KEY;
if (!key) throw new Error("FIREBASE_PRIVATE_KEY is missing in .env");

const formattedKey = Buffer.from(key, 'base64').toString('utf8');

// 2. Use Snake Case Keys
// The cert() method specifically looks for these exact keys:
const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: formattedKey
};

// 3. Robust Initialization
try {
    if (!admin.apps.length) {
        admin.initializeApp({
            // Passing the object with snake_case keys is the most compatible way
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Initialized successfully");
    }
} catch (error) {
    console.error("❌ Firebase Initialization Error:", error.message);
    // Log a safe version of the key to debug if needed
    console.log("Key starts with:", serviceAccount.private_key.substring(0, 30));
    process.exit(1); // Stop the server if Firebase isn't working
}

const db = admin.firestore();
module.exports = { db, admin };