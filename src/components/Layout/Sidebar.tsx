
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  ShoppingCart, 
  Factory, 
  Truck, 
  UserCheck, 
  FileText, 
  DollarSign,
  Settings,
  LogOut,
  Shield,
  BarChart3,
  Package,
  Building2,
  Cog
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { icon: Home, label: 'Dashboard', path: '/' }
    ];

    switch (user.role) {
      case 'super_admin':
      case 'admin':
        return [
          ...commonItems,
          { icon: Users, label: 'User Management', path: '/users' },
          { icon: Building2, label: 'Customers', path: '/customers' },
          { icon: ShoppingCart, label: 'Orders', path: '/orders' },
          { icon: Package, label: 'Materials', path: '/materials' },
          { icon: Cog, label: 'Machines', path: '/machines' },
          { icon: Factory, label: 'Production', path: '/production' },
          { icon: FileText, label: 'Invoices', path: '/invoices' },
          { icon: DollarSign, label: 'Payments', path: '/payments' },
          { icon: BarChart3, label: 'Reports', path: '/reports' },
          { icon: Settings, label: 'Settings', path: '/settings' }
        ];
      
      case 'accounts':
        return [
          ...commonItems,
          { icon: Building2, label: 'Customers', path: '/customers' },
          { icon: Package, label: 'Materials', path: '/materials' },
          { icon: FileText, label: 'Invoices', path: '/invoices' },
          { icon: DollarSign, label: 'Payments', path: '/payments' },
          { icon: BarChart3, label: 'Financial Reports', path: '/reports' }
        ];
      
      case 'production_manager':
        return [
          ...commonItems,
          { icon: ShoppingCart, label: 'Orders', path: '/orders' },
          { icon: Package, label: 'Materials', path: '/materials' },
          { icon: Cog, label: 'Machines', path: '/machines' },
          { icon: Factory, label: 'Production Jobs', path: '/production' },
          { icon: UserCheck, label: 'Worker Tasks', path: '/tasks' },
          { icon: BarChart3, label: 'Production Reports', path: '/reports' }
        ];
      
      case 'dispatch':
        return [
          ...commonItems,
          { icon: Package, label: 'Materials', path: '/materials' },
          { icon: Truck, label: 'Ready Orders', path: '/dispatch' },
          { icon: FileText, label: 'Dispatch Notes', path: '/dispatch-notes' }
        ];
      
      case 'worker':
        return [
          ...commonItems,
          { icon: Package, label: 'Materials', path: '/materials' },
          { icon: UserCheck, label: 'My Tasks', path: '/my-tasks' }
        ];
      
      case 'customer':
        return [
          ...commonItems,
          { icon: ShoppingCart, label: 'My Orders', path: '/my-orders' },
          { icon: FileText, label: 'My Invoices', path: '/my-invoices' },
          { icon: DollarSign, label: 'Payment History', path: '/my-payments' }
        ];
      
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleColor = (role: string) => {
    const colors = {
      super_admin: 'text-red-600 bg-red-50',
      admin: 'text-purple-600 bg-purple-50',
      accounts: 'text-green-600 bg-green-50',
      production_manager: 'text-blue-600 bg-blue-50',
      dispatch: 'text-orange-600 bg-orange-50',
      worker: 'text-gray-600 bg-gray-50',
      customer: 'text-indigo-600 bg-indigo-50'
    };
    return colors[role as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Factory className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">ManufactureFlow</h1>
        </div>
        
        {user && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
              {user.role.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        )}

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
