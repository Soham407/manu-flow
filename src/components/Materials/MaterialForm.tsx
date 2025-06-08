
import React, { useState, useEffect } from 'react';
import { Material } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MaterialFormProps {
  material: Material | null;
  onSave: (materialData: Partial<Material>) => void;
  onCancel: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    currentStock: 0,
    minStockLevel: 0,
    costPerMeter: 0,
    supplier: ''
  });

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        type: material.type,
        currentStock: material.currentStock,
        minStockLevel: material.minStockLevel,
        costPerMeter: material.costPerMeter,
        supplier: material.supplier || ''
      });
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Material Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Material Type</Label>
        <Input
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentStock">Current Stock (Meters)</Label>
          <Input
            id="currentStock"
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="minStockLevel">Minimum Stock Level (Meters)</Label>
          <Input
            id="minStockLevel"
            type="number"
            value={formData.minStockLevel}
            onChange={(e) => setFormData({ ...formData, minStockLevel: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPerMeter">Cost per Meter (₹)</Label>
          <Input
            id="costPerMeter"
            type="number"
            step="0.01"
            value={formData.costPerMeter}
            onChange={(e) => setFormData({ ...formData, costPerMeter: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {material ? 'Update Material' : 'Add Material'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MaterialForm;
