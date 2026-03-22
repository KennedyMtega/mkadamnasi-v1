import admin from 'firebase-admin';

/**
 * Firebase Admin SDK setup for server-side push notifications.
 * Initializes lazily using the FIREBASE_SERVICE_ACCOUNT environment variable.
 * Returns null if not configured — allows the app to work without Firebase.
 */
let firebaseApp: admin.app.App | null = null;

function getFirebaseApp(): admin.app.App | null {
  if (firebaseApp) return firebaseApp;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    console.warn('FIREBASE_SERVICE_ACCOUNT not set — push notifications disabled');
    return null;
  }

  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
    });
    return firebaseApp;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
}

/**
 * Get the Firebase Cloud Messaging instance.
 * Returns null if Firebase is not configured.
 */
export function getMessaging(): admin.messaging.Messaging | null {
  const app = getFirebaseApp();
  return app ? admin.messaging(app) : null;
}
