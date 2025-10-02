'use client';

import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AddTestCustomer() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addTestCustomer = async () => {
    setLoading(true);
    setMessage('');

    try {
      const testCustomer = {
        name: 'Test Customer ' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        phone: '081234567890',
        address: 'Jl. Test No. 123, Jakarta',
        registered: new Date(),
      };

      console.log('📝 Adding test customer:', testCustomer);
      console.log('🗃️ To collection:', COLLECTIONS.CUSTOMERS);
      
      const docRef = await addDoc(collection(db, COLLECTIONS.CUSTOMERS), testCustomer);
      
      setMessage(`✅ Test customer added with ID: ${docRef.id}`);
      console.log('✅ Customer added:', docRef.id);
      
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      console.error('❌ Add customer error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Add Test Customer</h2>
      
      <Button 
        onClick={addTestCustomer} 
        disabled={loading}
        className="w-full mb-4"
      >
        {loading ? 'Adding...' : 'Add Test Customer'}
      </Button>
      
      {message && (
        <div className={`text-sm p-2 rounded ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}