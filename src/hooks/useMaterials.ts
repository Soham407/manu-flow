import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Material } from '@/types';

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name');

      if (error) throw error;

      const formattedMaterials: Material[] = data.map(material => ({
        id: material.id,
        name: material.name,
        type: material.type,
        currentStock: Number(material.current_stock),
        minStockLevel: Number(material.min_stock_level),
        unit: material.unit as 'meters',
        costPerMeter: Number(material.cost_per_meter),
        supplier: material.supplier,
        lastUpdated: material.last_updated
      }));

      setMaterials(formattedMaterials);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const addMaterial = async (materialData: Partial<Material>) => {
    try {
      const { data: materialResult, error: materialError } = await supabase
        .from('materials')
        .insert({
          name: materialData.name,
          type: materialData.type,
          current_stock: materialData.currentStock || 0,
          min_stock_level: materialData.minStockLevel || 0,
          unit: materialData.unit || 'meters',
          cost_per_meter: materialData.costPerMeter || 0,
          supplier: materialData.supplier
        })
        .select()
        .single();

      if (materialError) throw materialError;
      
      await fetchMaterials(); // Refresh the list
      return materialResult;
    } catch (err) {
      console.error('Error adding material:', err);
      throw err;
    }
  };

  const updateMaterial = async (id: string, materialData: Partial<Material>) => {
    try {
      const { error } = await supabase
        .from('materials')
        .update({
          name: materialData.name,
          type: materialData.type,
          current_stock: materialData.currentStock,
          min_stock_level: materialData.minStockLevel,
          unit: materialData.unit,
          cost_per_meter: materialData.costPerMeter,
          supplier: materialData.supplier,
          last_updated: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchMaterials(); // Refresh the list
    } catch (err) {
      console.error('Error updating material:', err);
      throw err;
    }
  };

  return {
    materials,
    loading,
    error,
    addMaterial,
    updateMaterial,
    refetch: fetchMaterials
  };
};
