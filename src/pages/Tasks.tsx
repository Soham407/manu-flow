import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

const Tasks = () => {
  const { user } = useAuth();
  const { tasks, loading, error, assignTask, updateStatus } = useTasks();
  const { users } = useUsers();
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAssignTask = async () => {
    if (!selectedTask || !selectedWorkerId) return;

    try {
      const worker = users.find(u => u.id === selectedWorkerId);
      if (!worker) throw new Error('Worker not found');

      await assignTask(selectedTask.id, worker.id, worker.name);
      setIsAssignDialogOpen(false);
      setSelectedTask(null);
      setSelectedWorkerId('');

      toast({
        title: "Success",
        description: "Task assigned successfully",
      });
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: "Error",
        description: "Failed to assign task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'blocked') => {
    try {
      await updateStatus(taskId, newStatus);
      toast({
        title: "Success",
        description: `Task status updated to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <p className="text-red-600 mb-4">Error loading tasks: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const workerUsers = users.filter(u => u.role === 'worker');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worker Tasks</h1>
            <p className="text-gray-600">Manage and assign production tasks</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task List ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead className="hidden sm:table-cell">Job</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                    <TableHead className="hidden lg:table-cell">Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {task.jobTitle ? (
                          <div>
                            <div className="font-medium">{task.jobTitle}</div>
                            {task.orderId && (
                              <div className="text-sm text-gray-500">Order #{task.orderId}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {task.assignedWorkerName || (
                          <span className="text-gray-500">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm">
                            {task.actualHours || 0}h / {task.estimatedHours}h
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(((task.actualHours || 0) / task.estimatedHours) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {!task.assignedWorkerId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTask(task);
                                setIsAssignDialogOpen(true);
                              }}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Assign
                            </Button>
                          )}
                          {task.status === 'in_progress' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(task.id, 'completed')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete
                            </Button>
                          )}
                          {task.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Start
                            </Button>
                          )}
                          {task.status === 'blocked' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(task.id, 'pending')}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Unblock
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Task</DialogTitle>
              <DialogDescription>
                Select a worker to assign this task to.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Worker</label>
                <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a worker" />
                  </SelectTrigger>
                  <SelectContent>
                    {workerUsers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAssignDialogOpen(false);
                    setSelectedTask(null);
                    setSelectedWorkerId('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAssignTask}>
                  Assign Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Tasks;
