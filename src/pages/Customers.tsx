
import React from 'react';
import CustomersList from '@/components/Customers/CustomersList';

const Customers = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <CustomersList />
      </div>
    </div>
  );
};

export default Customers;
