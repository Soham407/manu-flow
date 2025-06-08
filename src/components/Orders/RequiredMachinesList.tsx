import React, { useState } from 'react';
import { Machine, OrderMachine } from '@/types';
import { useMachines } from '@/hooks/useMachines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RequiredMachinesListProps {
  selectedMachines: OrderMachine[];
  onMachinesChange: (machines: OrderMachine[]) => void;
}

const RequiredMachinesList: React.FC<RequiredMachinesListProps> = ({
  selectedMachines,
  onMachinesChange
}) => {
  const { machines, loading } = useMachines();
  const { toast } = useToast();
  const [isAddMachineOpen, setIsAddMachineOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [estimatedHoursInputValue, setEstimatedHoursInputValue] = useState('0');

  const getStatusColor = (status: string) => {
    const colors = {
      free: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddMachine = () => {
    if (!selectedMachineId || estimatedHours <= 0) {
      toast({
        title: "Error",
        description: "Please select a machine and specify estimated hours",
        variant: "destructive",
      });
      return;
    }

    const machine = machines.find(m => m.id === selectedMachineId);
    if (!machine) return;

    // Check if machine is already selected
    if (selectedMachines.some(sm => sm.machineId === selectedMachineId)) {
      toast({
        title: "Error",
        description: "This machine is already selected",
        variant: "destructive",
      });
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
    setIsAddMachineOpen(false);
    setSelectedMachineId('');
    setEstimatedHours(0);
    
    toast({
      title: "Success",
      description: "Machine added successfully",
    });
  };

  const handleRemoveMachine = (machineId: string) => {
    onMachinesChange(selectedMachines.filter(sm => sm.machineId !== machineId));
    toast({
      title: "Success",
      description: "Machine removed successfully",
    });
  };

  const handleEstimatedHoursFocus = () => {
    setEstimatedHoursInputValue(estimatedHours === 0 ? '' : estimatedHours.toString());
  };

  const handleEstimatedHoursBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      setEstimatedHoursInputValue('0');
      setEstimatedHours(0);
    } else {
      const numValue = parseInt(value) || 0;
      setEstimatedHoursInputValue(numValue.toString());
      setEstimatedHours(numValue);
    }
  };

  const handleEstimatedHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedHoursInputValue(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Required Machines</h3>
        <Dialog open={isAddMachineOpen} onOpenChange={setIsAddMachineOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Machine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Required Machine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Machine</Label>
                <Select value={selectedMachineId} onValueChange={setSelectedMachineId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a machine" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine) => (
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
              </div>

              <div className="space-y-2">
                <Label>Estimated Hours</Label>
                <Input
                  type="number"
                  min="1"
                  value={estimatedHoursInputValue}
                  onChange={handleEstimatedHoursChange}
                  onFocus={handleEstimatedHoursFocus}
                  onBlur={handleEstimatedHoursBlur}
                  placeholder="Enter estimated hours"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddMachineOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMachine}>
                  Add Machine
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estimated Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedMachines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No machines selected
                  </TableCell>
                </TableRow>
              ) : (
                selectedMachines.map((orderMachine) => {
                  const machine = machines.find(m => m.id === orderMachine.machineId);
                  return (
                    <TableRow key={orderMachine.id}>
                      <TableCell className="font-medium">{orderMachine.machineName}</TableCell>
                      <TableCell>
                        {machine && (
                          <Badge className={getStatusColor(machine.status)}>
                            {machine.status.toUpperCase()}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{orderMachine.estimatedHours}h</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMachine(orderMachine.machineId)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequiredMachinesList; 