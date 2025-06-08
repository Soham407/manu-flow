
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart, TrendingUp, Users, Package, DollarSign, Clock, Download } from 'lucide-react';

const ReportsList = () => {
  const { user } = useAuth();

  const reportCards = [
    {
      title: 'Financial Reports',
      description: 'Revenue, payments, outstanding balances',
      icon: DollarSign,
      stats: '₹2,45,000 Total Revenue',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Production Reports',
      description: 'Efficiency, machine utilization, delays',
      icon: Package,
      stats: '85% Efficiency Rate',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Worker Performance',
      description: 'Task completion, time tracking',
      icon: Users,
      stats: '12 Active Workers',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Order Analytics',
      description: 'Order trends, completion rates',
      icon: TrendingUp,
      stats: '92% On-time Delivery',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      title: 'Customer Analytics',
      description: 'Customer satisfaction, retention',
      icon: BarChart3,
      stats: '25 Active Customers',
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      title: 'Time Analytics',
      description: 'Production time, delivery schedules',
      icon: Clock,
      stats: 'Avg 3.2 days delivery',
      color: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-600">Business intelligence and performance metrics</p>
        </div>
        
        <Button className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {reportCards.map((report, index) => {
          const IconComponent = report.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <Button variant="ghost" size="sm">
                    <PieChart className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{report.stats}</span>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">48</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">₹3,67,000</div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">25</div>
              <div className="text-sm text-gray-600">Active Customers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">94%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsList;
