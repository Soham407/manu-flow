
import React from 'react';
import ReportsList from '@/components/Reports/ReportsList';

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <ReportsList />
      </div>
    </div>
  );
};

export default Reports;
