const admin = require('firebase-admin');
require('dotenv').config();

let serviceAccount;

try {
    // This looks for the literal string "\n" and turns it into a real newline character
    const formattedConfig = process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, '\n');
    serviceAccount = JSON.parse(formattedConfig);
} catch (error) {
    console.error("Firebase Config Error:", error.message);
    // Log the string length to see if it's actually loading
    console.log("Config String Length:", process.env.FIREBASE_SERVICE_ACCOUNT?.length);
    process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
module.exports = { db, admin };