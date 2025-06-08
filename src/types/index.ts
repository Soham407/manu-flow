export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'accounts' | 'production_manager' | 'dispatch' | 'worker' | 'customer';
  roles: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  advanceDeposit: number;
  createdAt: string;
  is_hidden: boolean;
  companies: Company[];
}

export interface Company {
  id: string;
  name: string;
  brands: Brand[];
}

export interface Brand {
  id: string;
  name: string;
  variants: string[];
}

export interface Material {
  id: string;
  name: string;
  type: string;
  currentStock: number; // in meters
  minStockLevel: number;
  unit: 'meters';
  costPerMeter: number;
  supplier?: string;
  lastUpdated: string;
}

export interface Order {
  id: string;
  customerId: string;
  customer?: Customer;
  customerName: string;
  companyName?: string;
  brandName?: string;
  variant?: string;
  description: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  status: 'pending' | 'in_production' | 'completed' | 'dispatched';
  productionStatus?: 'start' | 'waiting' | 'done';
  estimatedDelivery: string;
  createdAt: string;
  isHidden?: boolean;
  materialId?: string;
  materialUsed?: number; // in meters
  estimatedMaterialNeeded: number; // in meters
  machines?: OrderMachine[]; // Required machines for this order
  labelWidth?: number; // in millimeters
  labelHeight?: number; // in millimeters
}

export interface ProductionJob {
  id: string;
  orderId: string;
  title: string;
  description: string;
  status: 'created' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  actualHours?: number;
  createdAt: string;
  completedAt?: string;
}

export interface ProductionStep {
  id: string;
  jobId: string;
  title: string;
  description: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  estimatedHours: number;
  actualHours?: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'paid' | 'partial' | 'overdue';
  dueDate: string;
  createdAt: string;
  isHidden?: boolean;
}

export interface Payment {
  id: string;
  customerId: string;
  invoiceId?: string;
  amount: number;
  type: 'advance' | 'invoice_payment' | 'deposit';
  method: 'cash' | 'bank_transfer' | 'cheque' | 'online';
  reference?: string;
  createdAt: string;
  isHidden?: boolean;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'invoice' | 'order';
  amount: number;
  description: string;
  customerId?: string;
  customerName?: string;
  createdAt: string;
  isHidden?: boolean;
}

export interface Machine {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'free' | 'occupied' | 'maintenance';
  currentOrderId?: string;
  estimatedFreeTime?: string; // ISO date string
  specifications?: string;
  createdAt: string;
}

export interface OrderMachine {
  id: string;
  orderId: string;
  machineId: string;
  machineName: string;
  estimatedHours: number;
  startTime?: string;
  endTime?: string;
  status: 'scheduled' | 'running' | 'completed';
}
