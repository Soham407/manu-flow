
import React from 'react';
import PaymentsList from '@/components/Payments/PaymentsList';

const Payments = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <PaymentsList />
      </div>
    </div>
  );
};

export default Payments;
