import { useState, useEffect, useCallback } from 'react';
import { Task, getTasks, assignTask, updateTaskStatus, getWorkerTasks } from '@/services/taskService';

export const useTasks = (workerId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = workerId ? await getWorkerTasks(workerId) : await getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAssignTask = async (taskId: string, workerId: string, workerName: string) => {
    try {
      await assignTask(taskId, workerId, workerName);
      await fetchTasks();
    } catch (err) {
      console.error('Error assigning task:', err);
      throw err;
    }
  };

  const handleUpdateStatus = async (taskId: string, status: 'pending' | 'in_progress' | 'completed' | 'blocked', actualHours?: number) => {
    try {
      await updateTaskStatus(taskId, status, actualHours);
      await fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    assignTask: handleAssignTask,
    updateStatus: handleUpdateStatus,
    refetch: fetchTasks
  };
}; 