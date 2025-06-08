
import React, { useState } from 'react';
import { Payment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockCustomers } from '@/data/mockData';

interface PaymentFormProps {
  payment?: Payment | null;
  onSave: (payment: Partial<Payment>) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  payment,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    customerId: payment?.customerId || '',
    amount: payment?.amount || 0,
    type: payment?.type || 'advance',
    method: payment?.method || 'cash',
    reference: payment?.reference || ''
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="customer">Customer</Label>
        <Select value={formData.customerId} onValueChange={(value) => handleChange('customerId', value)}>
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
        <Label htmlFor="type">Payment Type</Label>
        <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="advance">Advance</SelectItem>
            <SelectItem value="invoice_payment">Invoice Payment</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="method">Payment Method</Label>
        <Select value={formData.method} onValueChange={(value) => handleChange('method', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
            <SelectItem value="online">Online</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="reference">Reference</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => handleChange('reference', e.target.value)}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1">
          {payment ? 'Update Payment' : 'Record Payment'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
