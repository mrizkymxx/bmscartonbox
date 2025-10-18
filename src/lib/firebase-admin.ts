import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
export function initializeFirebaseAdmin() {
  const adminApps = getApps();
  
  if (adminApps.length === 0) {
    // Check if we have the required environment variables
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('⚠️ Firebase Admin credentials not found, using client SDK fallback');
      // Return a minimal app for development/fallback
      return initializeApp({
        projectId: projectId || 'bms-cartonbox-424413',
      });
    }

    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      projectId,
    });
  }
  
  return adminApps[0];
}

const adminApp = initializeFirebaseAdmin();
const adminDb = getFirestore(adminApp);

export { adminDb };