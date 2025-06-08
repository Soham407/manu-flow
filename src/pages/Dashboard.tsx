import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import { 
  ShoppingCart, 
  Factory, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { getDashboardStats, DashboardStats } from '@/services/dashboardService';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { user, canSeeHiddenTransactions } = useAuth();
  const navigate = useNavigate();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats', user?.id, user?.role],
    queryFn: () => getDashboardStats(user?.id || '', user?.role || ''),
    enabled: !!user?.id && !!user?.role
  });

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const getDashboardData = () => {
    if (!stats) return [];

    switch (user?.role) {
      case 'super_admin':
      case 'admin':
        return [
          { 
            title: 'Total Orders', 
            value: stats.totalOrders?.toString() || '0', 
            icon: ShoppingCart, 
            color: 'blue' as const,
            path: '/orders'
          },
          { 
            title: 'Active Jobs', 
            value: stats.activeJobs?.toString() || '0', 
            icon: Factory, 
            color: 'green' as const,
            path: '/production'
          },
          { 
            title: 'Revenue (Month)', 
            value: formatCurrency(stats.monthlyRevenue || 0), 
            icon: DollarSign, 
            color: 'purple' as const,
            path: '/payments'
          },
          { 
            title: 'Total Users', 
            value: stats.totalUsers?.toString() || '0', 
            icon: Users, 
            color: 'orange' as const,
            path: '/users'
          }
        ];
      
      case 'accounts':
        return [
          { 
            title: 'Pending Invoices', 
            value: stats.pendingInvoices?.toString() || '0', 
            icon: ShoppingCart, 
            color: 'yellow' as const,
            path: '/invoices'
          },
          { 
            title: 'Outstanding Amount', 
            value: formatCurrency(stats.outstandingAmount || 0), 
            icon: DollarSign, 
            color: 'red' as const,
            path: '/payments'
          },
          { 
            title: 'Payments Received', 
            value: formatCurrency(stats.monthlyRevenue || 0), 
            icon: TrendingUp, 
            color: 'green' as const,
            path: '/payments'
          },
          { 
            title: 'Active Customers', 
            value: stats.activeCustomers?.toString() || '0', 
            icon: Users, 
            color: 'blue' as const,
            path: '/customers'
          }
        ];
      
      case 'production_manager':
        return [
          { 
            title: 'Active Jobs', 
            value: stats.activeJobs?.toString() || '0', 
            icon: Factory, 
            color: 'blue' as const,
            path: '/production'
          },
          { 
            title: 'Pending Tasks', 
            value: stats.pendingTasks?.toString() || '0', 
            icon: Clock, 
            color: 'yellow' as const,
            path: '/tasks'
          },
          { 
            title: 'Completed Today', 
            value: stats.completedToday?.toString() || '0', 
            icon: CheckCircle, 
            color: 'green' as const,
            path: '/production'
          },
          { 
            title: 'Issues/Delays', 
            value: stats.issuesDelays?.toString() || '0', 
            icon: AlertTriangle, 
            color: 'red' as const,
            path: '/production'
          }
        ];
      
      case 'dispatch':
        return [
          { 
            title: 'Ready to Dispatch', 
            value: stats.readyToDispatch?.toString() || '0', 
            icon: ShoppingCart, 
            color: 'green' as const,
            path: '/dispatch'
          },
          { 
            title: 'Dispatched Today', 
            value: stats.dispatchedToday?.toString() || '0', 
            icon: CheckCircle, 
            color: 'blue' as const,
            path: '/dispatch'
          },
          { 
            title: 'Pending Deliveries', 
            value: stats.pendingDeliveries?.toString() || '0', 
            icon: Clock, 
            color: 'yellow' as const,
            path: '/dispatch'
          },
          { 
            title: 'Total Dispatched', 
            value: stats.totalDispatched?.toString() || '0', 
            icon: TrendingUp, 
            color: 'purple' as const,
            path: '/dispatch'
          }
        ];
      
      case 'worker':
        return [
          { 
            title: 'My Active Tasks', 
            value: stats.myActiveTasks?.toString() || '0', 
            icon: Clock, 
            color: 'blue' as const,
            path: '/my-tasks'
          },
          { 
            title: 'Completed Today', 
            value: stats.myCompletedToday?.toString() || '0', 
            icon: CheckCircle, 
            color: 'green' as const,
            path: '/my-tasks'
          },
          { 
            title: 'Total Hours', 
            value: `${stats.totalHours?.toFixed(1) || '0'}h`, 
            icon: TrendingUp, 
            color: 'purple' as const,
            path: '/my-tasks'
          },
          { 
            title: 'Tasks This Week', 
            value: stats.tasksThisWeek?.toString() || '0', 
            icon: Factory, 
            color: 'orange' as const,
            path: '/my-tasks'
          }
        ];
      
      case 'customer':
        return [
          { 
            title: 'Active Orders', 
            value: stats.activeOrders?.toString() || '0', 
            icon: ShoppingCart, 
            color: 'blue' as const,
            path: '/my-orders'
          },
          { 
            title: 'Pending Invoices', 
            value: stats.pendingInvoices?.toString() || '0', 
            icon: DollarSign, 
            color: 'yellow' as const,
            path: '/my-invoices'
          },
          { 
            title: 'Account Balance', 
            value: formatCurrency(stats.accountBalance || 0), 
            icon: TrendingUp, 
            color: 'green' as const,
            path: '/my-payments'
          },
          { 
            title: 'Total Orders', 
            value: stats.totalOrders?.toString() || '0', 
            icon: CheckCircle, 
            color: 'purple' as const,
            path: '/my-orders'
          }
        ];
      
      default:
        return [];
    }
  };

  const dashboardData = getDashboardData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">Error loading dashboard data</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            {user?.role === 'super_admin' && (
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-700">
                  Hidden Transactions: {canSeeHiddenTransactions ? 'Visible' : 'Hidden'}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardData.map((item, index) => (
              <div 
                key={index} 
                onClick={() => handleCardClick(item.path)}
                className="cursor-pointer"
              >
                <DashboardCard {...item} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Order #1001 completed</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">New order received</p>
                    <p className="text-sm text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Payment received - ₹15,000</p>
                    <p className="text-sm text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {user?.role === 'production_manager' && (
                  <>
                    <button className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      Create Job
                    </button>
                    <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                      Assign Task
                    </button>
                  </>
                )}
                {user?.role === 'accounts' && (
                  <>
                    <button className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                      Create Invoice
                    </button>
                    <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                      Record Payment
                    </button>
                  </>
                )}
                {(user?.role === 'super_admin' || user?.role === 'admin') && (
                  <>
                    <button className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      Add User
                    </button>
                    <button className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                      View Reports
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
