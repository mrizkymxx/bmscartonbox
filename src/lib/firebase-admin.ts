import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
export function initializeFirebaseAdmin() {
  try {
    const adminApps = getApps();
    
    if (adminApps.length === 0) {
      // Check if we have the required environment variables
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

      // Debug logging for production
      if (process.env.NODE_ENV === 'production') {
        console.log('🔍 Firebase Admin Debug:', {
          hasProjectId: !!projectId,
          hasClientEmail: !!clientEmail,
          hasPrivateKey: !!privateKey,
          privateKeyPrefix: privateKey ? privateKey.substring(0, 30) + '...' : 'missing'
        });
      }

      if (!projectId) {
        throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing');
      }

      if (!clientEmail || !privateKey) {
        console.warn('⚠️ Firebase Admin credentials incomplete, using default auth');
        // Use default application credentials or throw error
        throw new Error('Firebase Admin credentials incomplete');
      }

      // Clean and validate private key format
      const cleanPrivateKey = privateKey.replace(/\\n/g, '\n');
      
      if (!cleanPrivateKey.includes('BEGIN PRIVATE KEY')) {
        throw new Error('Invalid private key format');
      }

      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: cleanPrivateKey,
        }),
        projectId,
      });
    }
    
    return adminApps[0];
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    throw error;
  }
}

const adminApp = initializeFirebaseAdmin();
const adminDb = getFirestore(adminApp);

export { adminDb };