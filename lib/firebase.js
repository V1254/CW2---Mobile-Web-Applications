import admin from "firebase-admin";
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
} catch (e) {
  // skip the nuicance already exists message when we are hot reloading for dev
  if (!/already exists/.test(e.message)) {
    console.error(`Critical Error: Firebase errored on initialization: `, e.stack);
  }
}

export default admin.firestore();
