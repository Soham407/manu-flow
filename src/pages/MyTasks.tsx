import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/services/taskService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const MyTasks = () => {
  const { user } = useAuth();
  const { tasks, loading, error, updateStatus } = useTasks(user?.id);
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [actualHours, setActualHours] = useState<string>('');

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleUpdateStatus = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'blocked', hours?: number) => {
    try {
      await updateStatus(taskId, newStatus, hours);
      setIsCompleteDialogOpen(false);
      setSelectedTask(null);
      setActualHours('');

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

  const handleCompleteTask = () => {
    if (!selectedTask) return;
    const hours = parseFloat(actualHours);
    if (isNaN(hours) || hours < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of hours",
        variant: "destructive",
      });
      return;
    }
    handleUpdateStatus(selectedTask.id, 'completed', hours);
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

  const activeTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600">Your assigned production tasks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Tasks ({activeTasks.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead className="hidden sm:table-cell">Job</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTasks.map((task) => (
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsCompleteDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {activeTasks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          No active tasks
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Completed Tasks ({completedTasks.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead className="hidden sm:table-cell">Job</TableHead>
                      <TableHead>Time Spent</TableHead>
                      <TableHead>Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTasks.map((task) => (
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
                          {task.actualHours}h
                        </TableCell>
                        <TableCell>
                          {new Date(task.completedAt!).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {completedTasks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          No completed tasks
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Task</DialogTitle>
              <DialogDescription>
                Enter the number of hours spent on this task.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Hours Spent</label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  placeholder="Enter hours spent"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCompleteDialogOpen(false);
                    setSelectedTask(null);
                    setActualHours('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCompleteTask}>
                  Complete Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyTasks;
