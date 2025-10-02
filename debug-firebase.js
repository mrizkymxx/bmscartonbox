// Debug script to check Firebase collections
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  // Add your Firebase config here
  // You can get this from your Firebase console
};

async function debugFirestore() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('🔍 Checking Firebase collections...');
    
    // Check customers collection
    const customersRef = collection(db, 'customers');
    const customersSnapshot = await getDocs(customersRef);
    
    console.log('📊 Customers collection:');
    console.log('  - Size:', customersSnapshot.size);
    console.log('  - Empty:', customersSnapshot.empty);
    
    if (!customersSnapshot.empty) {
      customersSnapshot.docs.forEach((doc) => {
        console.log('  - Doc ID:', doc.id);
        console.log('  - Data:', doc.data());
      });
    }
    
    // Check other collections
    const collections = ['purchaseOrders', 'deliveries', 'production'];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      console.log(`📊 ${collectionName} collection size:`, snapshot.size);
    }
    
  } catch (error) {
    console.error('❌ Firebase debug error:', error);
  }
}

// Run debug if this file is executed directly
if (require.main === module) {
  debugFirestore();
}

module.exports = { debugFirestore };