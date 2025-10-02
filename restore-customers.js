// Quick restore script untuk membuat sample data customers
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAFUf5AUsT8fvqHYvA_vDVVjBRuVXWsxwA",
  authDomain: "cartonflow-shyw4.firebaseapp.com",
  projectId: "cartonflow-shyw4",
  storageBucket: "cartonflow-shyw4.firebasestorage.app",
  messagingSenderId: "142328250405",
  appId: "1:142328250405:web:1939db7116e40b4cbfbfcc"
};

const sampleCustomers = [
  {
    name: "PT. Indofood Sukses Makmur",
    email: "procurement@indofood.co.id",
    phone: "021-5555-1234",
    address: "Jl. Sudirman Kav. 76-78, Jakarta Selatan 12190",
    registered: new Date("2024-01-15")
  },
  {
    name: "PT. Unilever Indonesia",
    email: "supply@unilever.co.id", 
    phone: "021-5555-5678",
    address: "Jl. BSD Boulevard Barat, Tangerang 15345",
    registered: new Date("2024-02-20")
  },
  {
    name: "PT. Nestle Indonesia",
    email: "orders@nestle.co.id",
    phone: "021-5555-9012",
    address: "Jl. TB Simatupang Kav. 88, Jakarta Selatan 12520",
    registered: new Date("2024-03-10")
  },
  {
    name: "CV. Berkah Jaya",
    email: "admin@berkahjaya.com",
    phone: "0274-5555-3456", 
    address: "Jl. Malioboro No. 45, Yogyakarta 55213",
    registered: new Date("2024-01-28")
  },
  {
    name: "UD. Maju Bersama",
    email: "info@majubersama.co.id",
    phone: "0341-5555-7890",
    address: "Jl. Soekarno Hatta No. 123, Malang 65141",
    registered: new Date("2024-02-14")
  }
];

async function restoreCustomerData() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('🔄 Restoring customer data...');
    
    for (const customer of sampleCustomers) {
      const docRef = await addDoc(collection(db, 'customers'), customer);
      console.log(`✅ Added customer: ${customer.name} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 Sample customer data restored successfully!');
    
  } catch (error) {
    console.error('❌ Error restoring data:', error);
  }
}

// Export for use
module.exports = { restoreCustomerData, sampleCustomers };

// Run if called directly
if (require.main === module) {
  restoreCustomerData();
}