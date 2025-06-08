import React, { useState } from 'react';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyManagement from './CompanyManagement';

interface CustomerFormProps {
  customer?: Customer | null;
  onSave: (customer: Partial<Customer>) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    advanceDeposit: customer?.advanceDeposit || 0
  });

  const [companies, setCompanies] = useState(customer?.companies || []);
  const [activeTab, setActiveTab] = useState('basic');
  const [depositInputValue, setDepositInputValue] = useState(formData.advanceDeposit.toString());

  const isBasicInfoComplete = () => {
    return formData.name.trim() !== '' && 
           formData.email.trim() !== '' && 
           formData.phone.trim() !== '' && 
           formData.address.trim() !== '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBasicInfoComplete()) {
      setActiveTab('basic');
      return;
    }
    onSave({
      ...formData,
      balance: formData.advanceDeposit,
      companies
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDepositFocus = () => {
    setDepositInputValue(formData.advanceDeposit === 0 ? '' : formData.advanceDeposit.toString());
  };

  const handleDepositBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      setDepositInputValue('0');
      handleChange('advanceDeposit', 0);
    } else {
      const numValue = parseInt(value) || 0;
      setDepositInputValue(numValue.toString());
      handleChange('advanceDeposit', numValue);
    }
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositInputValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="companies" disabled={!isBasicInfoComplete()}>Companies & Brands</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="name">Customer Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="advanceDeposit">Advance Deposit (₹)</Label>
            <Input
              id="advanceDeposit"
              type="number"
              value={depositInputValue}
              onChange={handleDepositChange}
              onFocus={handleDepositFocus}
              onBlur={handleDepositBlur}
              min="0"
              placeholder="Enter amount"
            />
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <CompanyManagement
            companies={companies}
            onCompaniesChange={setCompanies}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Customer
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
