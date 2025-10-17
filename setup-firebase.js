/**
 * Firebase Setup Script
 * Buat demo users dan setup Firestore security rules
 * 
 * Jalankan dengan: node setup-firebase.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Firebase Admin SDK service account
// Download dari Firebase Console → Project Settings → Service accounts
const serviceAccount = require('./firebase-admin-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'cartonflow-shyw4'
});

const auth = admin.auth();
const db = admin.firestore();

// Demo users data
const demoUsers = [
  {
    email: 'admin@bsmcartonbox.com',
    password: 'BSMAdmin2025!',
    role: 'admin',
    displayName: 'Administrator',
    isActive: true
  },
  {
    email: 'viewer@bsmcartonbox.com', 
    password: 'BSMViewer2025!',
    role: 'viewer',
    displayName: 'Viewer User',
    isActive: true
  }
];

async function setupUsers() {
  console.log('🔥 Setting up Firebase demo users...\n');

  for (const userData of demoUsers) {
    try {
      // Create Firebase Auth user
      console.log(`Creating user: ${userData.email}`);
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: true
      });

      console.log(`✅ Auth user created: ${userRecord.uid}`);

      // Create Firestore user document
      const userDoc = {
        id: userRecord.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        isActive: userData.isActive,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: null
      };

      await db.collection('users').doc(userRecord.uid).set(userDoc);
      console.log(`✅ Firestore document created for ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Password: ${userData.password}\n`);

    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠️  User ${userData.email} already exists, skipping...\n`);
      } else {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }
  }
}

async function setupFirestoreRules() {
  console.log('📋 Setting up Firestore security rules...\n');

  const rules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Admin can read/write everything, viewer can only read
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}`;

  // Save rules to file for manual upload
  fs.writeFileSync('./firestore.rules', rules);
  console.log('✅ Firestore rules saved to firestore.rules');
  console.log('📋 Please upload these rules to Firebase Console → Firestore → Rules\n');
}

async function main() {
  try {
    await setupUsers();
    await setupFirestoreRules();
    
    console.log('🎉 Firebase setup completed!\n');
    console.log('📋 Next steps:');
    console.log('1. Upload firestore.rules to Firebase Console');
    console.log('2. Test login with demo credentials');
    console.log('3. Verify role-based access control\n');
    
    console.log('🔑 Demo Credentials:');
    console.log('Admin: admin@bsmcartonbox.com / BSMAdmin2025!');
    console.log('Viewer: viewer@bsmcartonbox.com / BSMViewer2025!\n');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    process.exit(0);
  }
}

main();