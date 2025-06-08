import React, { useState } from 'react';
import { ProductionJob } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks/useOrders';

interface JobFormProps {
  job?: ProductionJob | null;
  onSave: (job: Partial<ProductionJob>) => void;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({
  job,
  onSave,
  onCancel
}) => {
  const { orders, loading: ordersLoading } = useOrders();
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    priority: job?.priority || 'medium',
    estimatedHours: job?.estimatedHours || 0,
    orderId: job?.orderId || null,
    status: job?.status || 'created'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="orderId">Order</Label>
        <Select 
          value={formData.orderId || ''} 
          onValueChange={(value) => handleChange('orderId', value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an order" />
          </SelectTrigger>
          <SelectContent>
            {ordersLoading ? (
              <SelectItem value="loading" disabled>Loading orders...</SelectItem>
            ) : (
              orders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  Order #{order.id} - {order.customer?.name || 'Unknown Customer'}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          placeholder="Enter job title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
          placeholder="Enter job description"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estimatedHours">Estimated Hours</Label>
          <Input
            id="estimatedHours"
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => handleChange('estimatedHours', parseFloat(e.target.value) || 0)}
            required
            min="0.5"
            step="0.5"
            placeholder="Enter estimated hours"
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1">
          {job ? 'Update Job' : 'Create Job'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
