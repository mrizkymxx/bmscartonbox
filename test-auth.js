/**
 * Test Firebase Authentication
 * Script untuk testing login/logout/reset password
 * 
 * Jalankan dengan: node test-auth.js
 */

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } = require('firebase/auth');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

// Firebase config (gunakan environment variables yang sama)
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Test credentials
const testUsers = [
  { email: 'admin@bsmcartonbox.com', password: 'BSMAdmin2025!', expectedRole: 'admin' },
  { email: 'viewer@bsmcartonbox.com', password: 'BSMViewer2025!', expectedRole: 'viewer' }
];

async function testLogin(email, password, expectedRole) {
  try {
    console.log(`\n🔐 Testing login: ${email}`);
    
    // Sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(`✅ Login successful: ${user.uid}`);
    
    // Get user document from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log(`✅ User data retrieved: ${userData.displayName}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Expected: ${expectedRole}`);
      
      if (userData.role === expectedRole) {
        console.log(`✅ Role verification: SUCCESS`);
      } else {
        console.log(`❌ Role verification: FAILED`);
      }
    } else {
      console.log(`❌ User document not found in Firestore`);
    }
    
    // Sign out
    await signOut(auth);
    console.log(`✅ Logout successful`);
    
    return true;
  } catch (error) {
    console.log(`❌ Login failed: ${error.message}`);
    return false;
  }
}

async function testPasswordReset(email) {
  try {
    console.log(`\n📧 Testing password reset: ${email}`);
    await sendPasswordResetEmail(auth, email);
    console.log(`✅ Password reset email sent successfully`);
    return true;
  } catch (error) {
    console.log(`❌ Password reset failed: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting Firebase Authentication Tests\n');
  console.log('Firebase Config:');
  console.log(`  Project ID: ${firebaseConfig.projectId}`);
  console.log(`  Auth Domain: ${firebaseConfig.authDomain}\n`);
  
  let passCount = 0;
  let totalTests = 0;
  
  // Test login for each user
  for (const testUser of testUsers) {
    totalTests++;
    const success = await testLogin(testUser.email, testUser.password, testUser.expectedRole);
    if (success) passCount++;
  }
  
  // Test password reset
  totalTests++;
  const resetSuccess = await testPasswordReset('admin@bsmcartonbox.com');
  if (resetSuccess) passCount++;
  
  // Results
  console.log(`\n📊 Test Results:`);
  console.log(`  Passed: ${passCount}/${totalTests}`);
  console.log(`  Failed: ${totalTests - passCount}/${totalTests}`);
  
  if (passCount === totalTests) {
    console.log(`\n🎉 All tests passed! Firebase Authentication is working correctly.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Please check the configuration.`);
  }
}

// Install dotenv if not exists
try {
  require('dotenv');
} catch (error) {
  console.log('Installing dotenv...');
  require('child_process').execSync('npm install dotenv', { stdio: 'inherit' });
}

runTests().catch(console.error);