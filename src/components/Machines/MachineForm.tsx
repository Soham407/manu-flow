
import React, { useState } from 'react';
import { Machine } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MachineFormProps {
  machine?: Machine | null;
  onSave: (machine: Partial<Machine>) => void;
  onCancel: () => void;
}

const MachineForm: React.FC<MachineFormProps> = ({
  machine,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: machine?.name || '',
    description: machine?.description || '',
    type: machine?.type || '',
    specifications: machine?.specifications || '',
    status: machine?.status || 'free'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Machine Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="type">Machine Type</Label>
        <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select machine type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="printing">Printing Machine</SelectItem>
            <SelectItem value="cutting">Cutting Machine</SelectItem>
            <SelectItem value="laminating">Laminating Machine</SelectItem>
            <SelectItem value="packaging">Packaging Machine</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="specifications">Specifications</Label>
        <Textarea
          id="specifications"
          value={formData.specifications}
          onChange={(e) => handleChange('specifications', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Under Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1">
          {machine ? 'Update Machine' : 'Add Machine'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MachineForm;
