
import React from 'react';
import MachinesList from '@/components/Machines/MachinesList';

const Machines = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <MachinesList />
      </div>
    </div>
  );
};

export default Machines;
