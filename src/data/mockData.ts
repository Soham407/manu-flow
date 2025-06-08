import { Customer, Order, ProductionJob, ProductionStep, Invoice, Payment, Transaction, Material } from '@/types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'ABC Manufacturing Ltd',
    email: 'contact@abcmfg.com',
    phone: '+91-9876543210',
    address: '123 Industrial Area, Mumbai',
    balance: -15000,
    advanceDeposit: 50000,
    createdAt: '2024-01-15',
    companies: [
      {
        id: 'comp1',
        name: 'ABC Industries',
        brands: [
          {
            id: 'brand1',
            name: 'ProLabel',
            variants: ['Waterproof', 'Premium', 'Standard']
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'XYZ Textiles',
    email: 'orders@xyztextiles.com',
    phone: '+91-9876543211',
    address: '456 Textile Hub, Chennai',
    balance: 25000,
    advanceDeposit: 75000,
    createdAt: '2024-02-01',
    companies: [
      {
        id: 'comp2',
        name: 'XYZ Corp',
        brands: [
          {
            id: 'brand2',
            name: 'TextileTag',
            variants: ['Premium', 'Standard']
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'GlobalTech Solutions',
    email: 'procurement@globaltech.com',
    phone: '+91-9876543212',
    address: '789 Tech Park, Bangalore',
    balance: 45000,
    advanceDeposit: 100000,
    createdAt: '2024-03-10',
    companies: [
      {
        id: 'comp3',
        name: 'GlobalTech Inc',
        brands: [
          {
            id: 'brand3',
            name: 'TechSticker',
            variants: ['Industrial', 'Commercial']
          }
        ]
      }
    ]
  }
];

export const mockMaterials: Material[] = [
  {
    id: '1',
    name: 'Vinyl Adhesive',
    type: 'Adhesive',
    currentStock: 500,
    minStockLevel: 100,
    unit: 'meters',
    costPerMeter: 15.50,
    supplier: 'Material Suppliers Ltd',
    lastUpdated: '2024-05-28'
  },
  {
    id: '2',
    name: 'Paper Labels',
    type: 'Paper',
    currentStock: 250,
    minStockLevel: 50,
    unit: 'meters',
    costPerMeter: 8.20,
    supplier: 'Paper Industries',
    lastUpdated: '2024-05-27'
  },
  {
    id: '3',
    name: 'Transparent Film',
    type: 'Film',
    currentStock: 75,
    minStockLevel: 25,
    unit: 'meters',
    costPerMeter: 22.00,
    supplier: 'Film Corp',
    lastUpdated: '2024-05-26'
  },
  {
    id: '4',
    name: 'Waterproof Vinyl',
    type: 'Vinyl',
    currentStock: 300,
    minStockLevel: 75,
    unit: 'meters',
    costPerMeter: 18.75,
    supplier: 'Waterproof Materials Inc',
    lastUpdated: '2024-05-25'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'ABC Manufacturing Ltd',
    companyName: 'ABC Industries',
    brandName: 'ProLabel',
    variant: 'Waterproof',
    description: 'Custom Labels - 10,000 units',
    quantity: 10000,
    pricePerUnit: 2.5,
    totalAmount: 25000,
    status: 'in_production',
    productionStatus: 'waiting',
    estimatedDelivery: '2024-06-15',
    createdAt: '2024-05-20',
    isHidden: false,
    materialId: '1',
    materialUsed: 45,
    estimatedMaterialNeeded: 50
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'XYZ Textiles',
    companyName: 'XYZ Corp',
    brandName: 'TextileTag',
    variant: 'Premium',
    description: 'Product Tags - 5,000 units',
    quantity: 5000,
    pricePerUnit: 3.0,
    totalAmount: 15000,
    status: 'completed',
    productionStatus: 'done',
    estimatedDelivery: '2024-06-10',
    createdAt: '2024-05-15',
    isHidden: true,
    materialId: '2',
    materialUsed: 20,
    estimatedMaterialNeeded: 25
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'GlobalTech Solutions',
    companyName: 'GlobalTech Inc',
    brandName: 'TechSticker',
    variant: 'Industrial',
    description: 'Warning Labels - 15,000 units',
    quantity: 15000,
    pricePerUnit: 1.8,
    totalAmount: 27000,
    status: 'pending',
    productionStatus: 'start',
    estimatedDelivery: '2024-07-01',
    createdAt: '2024-05-25',
    isHidden: false,
    materialId: '4',
    estimatedMaterialNeeded: 35
  }
];

export const mockJobs: ProductionJob[] = [
  {
    id: '1',
    orderId: '1',
    title: 'Custom Labels Production',
    description: 'Produce 10,000 custom labels for ABC Manufacturing',
    status: 'in_progress',
    priority: 'high',
    estimatedHours: 24,
    actualHours: 16,
    createdAt: '2024-05-21'
  },
  {
    id: '2',
    orderId: '2',
    title: 'Product Tags Production',
    description: 'Produce 5,000 product tags for XYZ Textiles',
    status: 'completed',
    priority: 'medium',
    estimatedHours: 16,
    actualHours: 18,
    createdAt: '2024-05-16',
    completedAt: '2024-05-25'
  }
];

export const mockSteps: ProductionStep[] = [
  {
    id: '1',
    jobId: '1',
    title: 'Material Preparation',
    description: 'Prepare raw materials for label production',
    assignedWorkerId: '6',
    assignedWorkerName: 'Worker',
    status: 'completed',
    estimatedHours: 4,
    actualHours: 3.5,
    createdAt: '2024-05-21',
    completedAt: '2024-05-21'
  },
  {
    id: '2',
    jobId: '1',
    title: 'Printing Process',
    description: 'Print labels using industrial printer',
    assignedWorkerId: '6',
    assignedWorkerName: 'Worker',
    status: 'in_progress',
    estimatedHours: 12,
    actualHours: 8,
    createdAt: '2024-05-22'
  },
  {
    id: '3',
    jobId: '1',
    title: 'Quality Control',
    description: 'Check label quality and finish',
    status: 'pending',
    estimatedHours: 4,
    createdAt: '2024-05-22'
  },
  {
    id: '4',
    jobId: '1',
    title: 'Packaging',
    description: 'Package labels for dispatch',
    status: 'pending',
    estimatedHours: 4,
    createdAt: '2024-05-22'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'ABC Manufacturing Ltd',
    orderId: '1',
    amount: 25000,
    status: 'pending',
    dueDate: '2024-06-20',
    createdAt: '2024-05-25',
    isHidden: false
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'XYZ Textiles',
    orderId: '2',
    amount: 15000,
    status: 'paid',
    dueDate: '2024-06-15',
    createdAt: '2024-05-20',
    isHidden: true
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'GlobalTech Solutions',
    orderId: '3',
    amount: 27000,
    status: 'overdue',
    dueDate: '2024-06-25',
    createdAt: '2024-05-26',
    isHidden: false
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    customerId: '1',
    amount: 50000,
    type: 'advance',
    method: 'bank_transfer',
    reference: 'TXN001',
    createdAt: '2024-05-10',
    isHidden: false
  },
  {
    id: '2',
    customerId: '2',
    invoiceId: '2',
    amount: 15000,
    type: 'invoice_payment',
    method: 'online',
    reference: 'TXN002',
    createdAt: '2024-05-26',
    isHidden: true
  },
  {
    id: '3',
    customerId: '3',
    amount: 25000,
    type: 'advance',
    method: 'cheque',
    reference: 'CHQ003',
    createdAt: '2024-05-28',
    isHidden: false
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'payment',
    amount: 50000,
    description: 'Advance payment from ABC Manufacturing Ltd',
    customerId: '1',
    customerName: 'ABC Manufacturing Ltd',
    createdAt: '2024-05-10',
    isHidden: false
  },
  {
    id: '2',
    type: 'invoice',
    amount: 25000,
    description: 'Invoice for Custom Labels',
    customerId: '1',
    customerName: 'ABC Manufacturing Ltd',
    createdAt: '2024-05-25',
    isHidden: false
  },
  {
    id: '3',
    type: 'payment',
    amount: 15000,
    description: 'Payment for Product Tags',
    customerId: '2',
    customerName: 'XYZ Textiles',
    createdAt: '2024-05-26',
    isHidden: true
  },
  {
    id: '4',
    type: 'order',
    amount: 27000,
    description: 'Order for Warning Labels',
    customerId: '3',
    customerName: 'GlobalTech Solutions',
    createdAt: '2024-05-25',
    isHidden: false
  }
];
