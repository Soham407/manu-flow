import { supabase } from '@/lib/supabase';
import { ProductionStep } from '@/types';

export interface Task extends ProductionStep {
  jobTitle?: string;
  orderId?: string;
}

interface TaskUpdateData {
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  completed_at?: string;
  actual_hours?: number;
}

export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('production_steps')
      .select(`
        *,
        production_jobs (
          title,
          order_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(task => ({
      id: task.id,
      jobId: task.job_id,
      title: task.title,
      description: task.description,
      assignedWorkerId: task.assigned_worker_id,
      assignedWorkerName: task.assigned_worker_name,
      status: task.status,
      estimatedHours: task.estimated_hours,
      actualHours: task.actual_hours,
      notes: task.notes,
      createdAt: task.created_at,
      completedAt: task.completed_at,
      jobTitle: task.production_jobs?.title,
      orderId: task.production_jobs?.order_id
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const assignTask = async (taskId: string, workerId: string, workerName: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('production_steps')
      .update({
        assigned_worker_id: workerId,
        assigned_worker_name: workerName,
        status: 'in_progress'
      })
      .eq('id', taskId);

    if (error) throw error;
  } catch (error) {
    console.error('Error assigning task:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId: string, status: 'pending' | 'in_progress' | 'completed' | 'blocked', actualHours?: number): Promise<void> => {
  try {
    const updateData: TaskUpdateData = { status };
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
      if (actualHours) {
        updateData.actual_hours = actualHours;
      }
    }

    const { error } = await supabase
      .from('production_steps')
      .update(updateData)
      .eq('id', taskId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

export const getWorkerTasks = async (workerId: string): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('production_steps')
      .select(`
        *,
        production_jobs (
          title,
          order_id
        )
      `)
      .eq('assigned_worker_id', workerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(task => ({
      id: task.id,
      jobId: task.job_id,
      title: task.title,
      description: task.description,
      assignedWorkerId: task.assigned_worker_id,
      assignedWorkerName: task.assigned_worker_name,
      status: task.status,
      estimatedHours: task.estimated_hours,
      actualHours: task.actual_hours,
      notes: task.notes,
      createdAt: task.created_at,
      completedAt: task.completed_at,
      jobTitle: task.production_jobs?.title,
      orderId: task.production_jobs?.order_id
    }));
  } catch (error) {
    console.error('Error fetching worker tasks:', error);
    throw error;
  }
}; 