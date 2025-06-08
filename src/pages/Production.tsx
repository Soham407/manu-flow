
import React from 'react';
import ProductionList from '@/components/Production/ProductionList';

const Production = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <ProductionList />
      </div>
    </div>
  );
};

export default Production;
