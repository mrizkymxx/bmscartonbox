'use client';

import { useEffect, useState } from 'react';
import { getAllCustomers } from '@/lib/actions/customers';
import { CustomerEntity } from '@/lib/schemas';

export default function CustomerTestPage() {
  const [customers, setCustomers] = useState<CustomerEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        console.log('🔄 Loading customers...');
        const data = await getAllCustomers();
        console.log('✅ Loaded customers:', data);
        setCustomers(data);
      } catch (err: any) {
        console.error('❌ Error loading customers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  if (loading) return <div className="p-6">Loading customers...</div>;

  if (error) return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-red-600 mb-4">Error Loading Customers</h1>
      <p className="text-red-600">{error}</p>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Test</h1>
      <p className="mb-4">Found {customers.length} customers</p>
      
      {customers.length > 0 ? (
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.id} className="border p-4 rounded">
              <h3 className="font-semibold">{customer.name}</h3>
              <p className="text-sm text-gray-600">{customer.email}</p>
              <p className="text-sm text-gray-600">{customer.phone}</p>
              <p className="text-sm text-gray-600">{customer.address}</p>
              <p className="text-xs text-gray-500">Registered: {customer.registered}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No customers found</p>
      )}
    </div>
  );
}