import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { ProductionJob } from '@/types';

export const useProductionJobs = () => {
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('production_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedJobs: ProductionJob[] = data.map(job => ({
        id: job.id,
        orderId: job.order_id,
        title: job.title,
        description: job.description,
        status: job.status,
        priority: job.priority,
        estimatedHours: job.estimated_hours,
        actualHours: job.actual_hours,
        createdAt: job.created_at,
        completedAt: job.completed_at
      }));

      setJobs(formattedJobs);
    } catch (err) {
      console.error('Error fetching production jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch production jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const addJob = async (jobData: Partial<ProductionJob>) => {
    try {
      const { data: jobResult, error: jobError } = await supabase
        .from('production_jobs')
        .insert({
          order_id: jobData.orderId,
          title: jobData.title,
          description: jobData.description,
          status: jobData.status || 'created',
          priority: jobData.priority || 'medium',
          estimated_hours: jobData.estimatedHours,
          actual_hours: jobData.actualHours
        })
        .select()
        .single();

      if (jobError) throw jobError;
      
      await fetchJobs(); // Refresh the list
      return jobResult;
    } catch (err) {
      console.error('Error adding production job:', err);
      throw err;
    }
  };

  const updateJob = async (id: string, jobData: Partial<ProductionJob>) => {
    try {
      const { error } = await supabase
        .from('production_jobs')
        .update({
          order_id: jobData.orderId,
          title: jobData.title,
          description: jobData.description,
          status: jobData.status,
          priority: jobData.priority,
          estimated_hours: jobData.estimatedHours,
          actual_hours: jobData.actualHours,
          completed_at: jobData.completedAt
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchJobs(); // Refresh the list
    } catch (err) {
      console.error('Error updating production job:', err);
      throw err;
    }
  };

  return {
    jobs,
    loading,
    error,
    addJob,
    updateJob,
    refetch: fetchJobs
  };
};
