
import React, { useState } from 'react';
import { Machine, OrderMachine } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface MachineSelectionProps {
  selectedMachines: OrderMachine[];
  onMachinesChange: (machines: OrderMachine[]) => void;
}

const MachineSelection: React.FC<MachineSelectionProps> = ({
  selectedMachines,
  onMachinesChange
}) => {
  // Mock machines data - in real app, this would come from API
  const availableMachines: Machine[] = [
    {
      id: '1',
      name: 'Label Printer Pro 1',
      description: 'High-speed label printing machine',
      type: 'printing',
      status: 'free',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Industrial Cutter X1',
      description: 'Precision cutting machine',
      type: 'cutting',
      status: 'occupied',
      estimatedFreeTime: '2024-02-15T14:00:00Z',
      createdAt: '2024-01-05'
    },
    {
      id: '3',
      name: 'Laminator Pro',
      description: 'Professional laminating machine',
      type: 'laminating',
      status: 'free',
      createdAt: '2024-01-10'
    }
  ];

  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(0);

  const addMachine = () => {
    if (!selectedMachineId || estimatedHours <= 0) return;
    
    const machine = availableMachines.find(m => m.id === selectedMachineId);
    if (!machine) return;

    // Check if machine is already selected
    if (selectedMachines.some(sm => sm.machineId === selectedMachineId)) {
      return;
    }

    const newOrderMachine: OrderMachine = {
      id: Date.now().toString(),
      orderId: '', // Will be set when order is created
      machineId: selectedMachineId,
      machineName: machine.name,
      estimatedHours,
      status: 'scheduled'
    };

    onMachinesChange([...selectedMachines, newOrderMachine]);
    setSelectedMachineId('');
    setEstimatedHours(0);
  };

  const removeMachine = (machineId: string) => {
    onMachinesChange(selectedMachines.filter(sm => sm.machineId !== machineId));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      free: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <Label>Required Machines</Label>
      
      <div className="grid grid-cols-3 gap-2">
        <Select value={selectedMachineId} onValueChange={setSelectedMachineId}>
          <SelectTrigger>
            <SelectValue placeholder="Select machine" />
          </SelectTrigger>
          <SelectContent>
            {availableMachines.map((machine) => (
              <SelectItem key={machine.id} value={machine.id}>
                <div className="flex items-center gap-2">
                  {machine.name}
                  <Badge className={getStatusColor(machine.status)} variant="outline">
                    {machine.status}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          type="number"
          placeholder="Hours"
          value={estimatedHours}
          onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
          min="1"
        />
        
        <Button type="button" onClick={addMachine} disabled={!selectedMachineId || estimatedHours <= 0}>
          Add
        </Button>
      </div>

      {selectedMachines.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Machines:</Label>
          {selectedMachines.map((orderMachine) => {
            const machine = availableMachines.find(m => m.id === orderMachine.machineId);
            return (
              <div key={orderMachine.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{orderMachine.machineName}</span>
                  <span className="text-sm text-gray-500">({orderMachine.estimatedHours}h)</span>
                  {machine && (
                    <Badge className={getStatusColor(machine.status)} variant="outline">
                      {machine.status}
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMachine(orderMachine.machineId)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MachineSelection;
