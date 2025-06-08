import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProductionJobs } from '@/hooks/useProductionJobs';
import { ProductionJob } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Play, Pause, Loader2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import JobForm from './JobForm';
import { supabase } from '@/lib/supabase';

const ProductionList = () => {
  const { user } = useAuth();
  const { jobs, loading, error, addJob, updateJob } = useProductionJobs();
  const { toast } = useToast();
  
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<ProductionJob | null>(null);
  const [selectedJob, setSelectedJob] = useState<ProductionJob | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        jobs.forEach(job => {
          if (job.status === 'in_progress') {
            newTimers[job.id] = (newTimers[job.id] || 0) + 1;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [jobs]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      created: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddJob = () => {
    setEditingJob(null);
    setIsJobFormOpen(true);
  };

  const handleSaveJob = async (jobData: Partial<ProductionJob>) => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobData);
        toast({
          title: "Success",
          description: "Production job updated successfully!",
        });
      } else {
        await addJob(jobData);
        toast({
          title: "Success",
          description: "Production job created successfully!",
        });
      }
      setIsJobFormOpen(false);
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save production job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: 'created' | 'in_progress' | 'completed' | 'on_hold') => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error('Job not found');

      // Update job status
      await updateJob(jobId, { 
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
      });

      // If job is completed, update the order's production status
      if (newStatus === 'completed' && job.orderId) {
        // Check if all jobs for this order are completed
        const orderJobs = jobs.filter(j => j.orderId === job.orderId);
        const allJobsCompleted = orderJobs.every(j => 
          j.id === jobId ? newStatus === 'completed' : j.status === 'completed'
        );

        if (allJobsCompleted) {
          // Update order's production status to 'done'
          const { error: orderError } = await supabase
            .from('orders')
            .update({ production_status: 'done' })
            .eq('id', job.orderId);

          if (orderError) throw orderError;
        }
      }

      toast({
        title: "Success",
        description: `Job status updated to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: "Error",
        description: "Failed to update job status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewJob = (job: ProductionJob) => {
    setSelectedJob(job);
    setIsViewDialogOpen(true);
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
          <p className="text-red-600 mb-4">Error loading production jobs: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Production Management</h2>
          <p className="text-sm text-gray-600">Manage production jobs and workflows</p>
        </div>
        
        {(user?.role === 'production_manager' || user?.role === 'admin' || user?.role === 'super_admin') && (
          <Dialog open={isJobFormOpen} onOpenChange={setIsJobFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddJob} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg mx-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingJob ? 'Edit Production Job' : 'Create New Job'}
                </DialogTitle>
                <DialogDescription>
                  {editingJob ? 'Update the details of this production job.' : 'Fill in the details to create a new production job.'}
                </DialogDescription>
              </DialogHeader>
              <JobForm
                job={editingJob}
                onSave={handleSaveJob}
                onCancel={() => setIsJobFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Production Jobs ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden lg:table-cell">Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">{job.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">#{job.orderId}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={getPriorityColor(job.priority)}>
                        {job.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">
                          {job.actualHours || 0}h / {job.estimatedHours}h
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(((job.actualHours || 0) / job.estimatedHours) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                          onClick={() => handleViewJob(job)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {job.status === 'in_progress' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
                            onClick={() => handleStatusChange(job.id, 'on_hold')}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        ) : job.status === 'on_hold' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                            onClick={() => handleStatusChange(job.id, 'in_progress')}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                        ) : job.status === 'created' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                            onClick={() => handleStatusChange(job.id, 'in_progress')}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Job Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>
              View detailed information about this production job
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Title</h3>
                  <p className="mt-1">{selectedJob.title}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Status</h3>
                  <Badge className={getStatusColor(selectedJob.status)}>
                    {selectedJob.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Priority</h3>
                  <Badge className={getPriorityColor(selectedJob.priority)}>
                    {selectedJob.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Order ID</h3>
                  <p className="mt-1">#{selectedJob.orderId}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Description</h3>
                <p className="mt-1">{selectedJob.description}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-sm text-gray-500 mb-2">Time Tracking</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">Estimated Hours</h4>
                    <p className="text-lg font-semibold">{selectedJob.estimatedHours}h</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Actual Hours</h4>
                    <p className="text-lg font-semibold">{selectedJob.actualHours || 0}h</p>
                  </div>
                  {selectedJob.status === 'in_progress' && (
                    <div className="col-span-2">
                      <h4 className="text-sm text-gray-500">Current Session</h4>
                      <p className="text-2xl font-mono font-semibold text-blue-600">
                        {formatTime(timers[selectedJob.id] || 0)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductionList;
