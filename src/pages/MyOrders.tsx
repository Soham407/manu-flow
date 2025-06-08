
import React from 'react';
import OrdersList from '@/components/Orders/OrdersList';

const MyOrders = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <OrdersList />
      </div>
    </div>
  );
};

export default MyOrders;
