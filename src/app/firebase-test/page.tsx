'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/constants';
import AddTestCustomer from '@/components/test/add-test-customer';

export default function FirebaseTestPage() {
  const [status, setStatus] = useState<string>('Testing...');
  const [customers, setCustomers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testFirebase() {
      try {
        console.log('🔥 Testing Firebase connection...');
        console.log('📊 Collections constant:', COLLECTIONS);
        
        // Test multiple possible collection names
        const possibleNames = [
          'customers', 
          'customer', 
          'customerData', 
          'customer-data',
          'clients',
          'pelanggan'
        ];
        
        const results = [];
        
        for (const collectionName of possibleNames) {
          try {
            console.log(`� Testing collection: ${collectionName}`);
            const testRef = collection(db, collectionName);
            const testSnapshot = await getDocs(testRef);
            
            if (!testSnapshot.empty) {
              const data = testSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              results.push({
                name: collectionName,
                count: testSnapshot.size,
                data: data
              });
              console.log(`✅ Found data in ${collectionName}:`, data);
            } else {
              console.log(`📭 Empty collection: ${collectionName}`);
            }
          } catch (error) {
            console.log(`❌ Error accessing ${collectionName}:`, error);
          }
        }
        
        if (results.length > 0) {
          setCustomers(results);
          setStatus(`✅ Found data in ${results.length} collection(s)`);
        } else {
          setStatus('✅ Connected but no customer data found in any collection');
          setCustomers([]);
        }
        
      } catch (err: any) {
        console.error('❌ Firebase test error:', err);
        setError(err.message);
        setStatus('❌ Connection failed');
      }
    }

    testFirebase();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Status:</h2>
            <p className={`text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
              {status}
            </p>
          </div>

          {error && (
            <div>
              <h2 className="text-lg font-semibold text-red-600">Error:</h2>
              <p className="text-sm text-red-600 font-mono">{error}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold">Configuration:</h2>
            <ul className="text-sm space-y-1">
              <li><strong>Collection Name:</strong> {COLLECTIONS.CUSTOMERS}</li>
              <li><strong>Firebase Project:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</li>
            </ul>
          </div>
        </div>
        
        <div>
          <AddTestCustomer />
        </div>
      </div>

      {customers.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Found Data:</h2>
          <div className="space-y-4">
            {customers.map((result: any, index: number) => (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-semibold">Collection: {result.name} ({result.count} items)</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto mt-2">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}