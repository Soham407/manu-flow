import React, { useState } from 'react';
import { useMachines } from '@/hooks/useMachines';
import { Machine } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import MachineForm from './MachineForm';

const MachinesList = () => {
  const { machines, loading, error, addMachine, updateMachine } = useMachines();
  const { toast } = useToast();

  const [isMachineFormOpen, setIsMachineFormOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    const colors = {
      free: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddMachine = () => {
    setEditingMachine(null);
    setIsMachineFormOpen(true);
  };

  const handleEditMachine = (machine: Machine) => {
    setEditingMachine(machine);
    setIsMachineFormOpen(true);
  };

  const handleSaveMachine = async (machineData: Partial<Machine>) => {
    try {
      if (editingMachine) {
        await updateMachine(editingMachine.id, machineData);
        toast({
          title: "Success",
          description: "Machine updated successfully!",
        });
      } else {
        await addMachine(machineData);
        toast({
          title: "Success",
          description: "Machine added successfully!",
        });
      }
      setIsMachineFormOpen(false);
    } catch (error) {
      console.error('Error saving machine:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save machine. Please try again.",
        variant: "destructive",
      });
    }
  };

  const searchFilteredMachines = machines.filter(machine => {
    const searchLower = searchQuery.toLowerCase();
    return (
      machine.name.toLowerCase().includes(searchLower) ||
      machine.type.toLowerCase().includes(searchLower) ||
      machine.description.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading machines: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Machine Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage production machines and track their availability
          </p>
        </div>
        
        <Dialog open={isMachineFormOpen} onOpenChange={setIsMachineFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddMachine} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Machine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMachine ? 'Edit Machine' : 'Add New Machine'}
              </DialogTitle>
            </DialogHeader>
            <MachineForm
              machine={editingMachine}
              onSave={handleSaveMachine}
              onCancel={() => setIsMachineFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Machines ({searchFilteredMachines.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search machines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Machine Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Estimated Free Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchFilteredMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.name}</TableCell>
                    <TableCell className="capitalize">{machine.type}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="max-w-[200px] truncate">{machine.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(machine.status)}>
                        {machine.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {machine.estimatedFreeTime 
                        ? new Date(machine.estimatedFreeTime).toLocaleString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMachine(machine)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MachinesList;
