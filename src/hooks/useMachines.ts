import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Machine } from '@/types';

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMachines: Machine[] = data.map(machine => ({
        id: machine.id,
        name: machine.name,
        description: machine.description,
        type: machine.type,
        status: machine.status,
        currentOrderId: machine.current_order_id,
        estimatedFreeTime: machine.estimated_free_time,
        specifications: machine.specifications,
        createdAt: machine.created_at
      }));

      setMachines(formattedMachines);
    } catch (err) {
      console.error('Error fetching machines:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch machines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const addMachine = async (machineData: Partial<Machine>) => {
    try {
      const { data: machineResult, error: machineError } = await supabase
        .from('machines')
        .insert({
          name: machineData.name,
          description: machineData.description,
          type: machineData.type,
          status: machineData.status || 'free',
          specifications: machineData.specifications
        })
        .select()
        .single();

      if (machineError) throw machineError;
      
      await fetchMachines(); // Refresh the list
      return machineResult;
    } catch (err) {
      console.error('Error adding machine:', err);
      throw err;
    }
  };

  const updateMachine = async (id: string, machineData: Partial<Machine>) => {
    try {
      const { error } = await supabase
        .from('machines')
        .update({
          name: machineData.name,
          description: machineData.description,
          type: machineData.type,
          status: machineData.status,
          specifications: machineData.specifications,
          current_order_id: machineData.currentOrderId,
          estimated_free_time: machineData.estimatedFreeTime
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchMachines(); // Refresh the list
    } catch (err) {
      console.error('Error updating machine:', err);
      throw err;
    }
  };

  return {
    machines,
    loading,
    error,
    addMachine,
    updateMachine,
    refetch: fetchMachines
  };
};
