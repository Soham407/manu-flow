
import React, { useState } from 'react';
import { Invoice } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockCustomers } from '@/data/mockData';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSave: (invoice: Partial<Invoice>) => void;
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    customerId: invoice?.customerId || '',
    customerName: invoice?.customerName || '',
    amount: invoice?.amount || 0,
    dueDate: invoice?.dueDate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = mockCustomers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="customer">Customer</Label>
        <Select value={formData.customerId} onValueChange={handleCustomerChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {mockCustomers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
          required
          min="0"
        />
      </div>
      
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          required
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1">
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
