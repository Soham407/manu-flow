import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@company.com',
    name: 'Super Admin',
    role: 'super_admin',
    roles: ['super_admin'],
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
    roles: ['admin'],
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    email: 'accounts@company.com',
    name: 'Accounts Manager',
    role: 'accounts',
    roles: ['accounts'],
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    email: 'production@company.com',
    name: 'Production Manager',
    role: 'production_manager',
    roles: ['production_manager'],
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '5',
    email: 'dispatch@company.com',
    name: 'Dispatch User',
    role: 'dispatch',
    roles: ['dispatch'],
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '6',
    email: 'worker@company.com',
    name: 'Worker',
    role: 'worker',
    roles: ['worker'],
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '7',
    email: 'customer@company.com',
    name: 'Customer User',
    role: 'customer',
    roles: ['customer'],
    isActive: true,
    createdAt: '2024-01-01'
  }
]; 