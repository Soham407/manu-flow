
import React from 'react';
import MaterialsList from '@/components/Materials/MaterialsList';

const Materials = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <MaterialsList />
      </div>
    </div>
  );
};

export default Materials;
