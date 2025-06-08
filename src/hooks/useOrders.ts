import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching orders...');
      
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('orders')
        .select('id')
        .limit(1);
        
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Supabase connection successful, proceeding with full query...');
      
      let query = supabase
        .from('orders')
        .select(`
          id,
          customer_id,
          customer_name,
          company_name,
          brand_name,
          variant,
          description,
          quantity,
          price_per_unit,
          total_amount,
          status,
          production_status,
          estimated_delivery,
          material_id,
          material_used,
          estimated_material_needed,
          created_at,
          is_hidden,
          label_width,
          label_height,
          customers (
            id,
            name,
            email,
            phone,
            address,
            balance,
            advance_deposit,
            created_at,
            is_hidden
          ),
          order_machines (
            id,
            machine_id,
            machine_name,
            estimated_hours,
            status
          )
        `)
        .order('created_at', { ascending: false });

      // If user is a customer, only show their orders
      if (user?.role === 'customer') {
        // First get the customer ID from the customers table
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('email', user.email)
          .single();

        if (customerError) {
          console.error('Error fetching customer data:', customerError);
          throw customerError;
        }

        if (customerData) {
          query = query.eq('customer_id', customerData.id);
        }
      }

      console.log('Executing orders query...');
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Orders fetched successfully:', data?.length || 0, 'orders found');

      const formattedOrders: Order[] = data.map(order => {
        console.log('Order object:', order);
        return {
          id: order.id,
          customerId: order.customer_id,
          customerName: order.customer_name,
          companyName: order.company_name,
          brandName: order.brand_name,
          variant: order.variant,
          description: order.description,
          quantity: order.quantity,
          pricePerUnit: order.price_per_unit,
          totalAmount: order.total_amount,
          status: order.status,
          productionStatus: order.production_status,
          estimatedDelivery: order.estimated_delivery,
          materialId: order.material_id,
          materialUsed: order.material_used,
          estimatedMaterialNeeded: order.estimated_material_needed,
          createdAt: order.created_at,
          isHidden: order.is_hidden,
          labelWidth: order.label_width,
          labelHeight: order.label_height,
          customer: order.customers ? {
            id: order.customers['id'],
            name: order.customers['name'],
            email: order.customers['email'],
            phone: order.customers['phone'],
            address: order.customers['address'],
            balance: order.customers['balance'],
            advanceDeposit: order.customers['advance_deposit'],
            createdAt: order.customers['created_at'],
            is_hidden: order.customers['is_hidden'],
            companies: []
          } : undefined,
          machines: order.order_machines?.map(machine => ({
            id: machine.id,
            orderId: order.id,
            machineId: machine.machine_id,
            machineName: machine.machine_name,
            estimatedHours: machine.estimated_hours,
            status: machine.status
          })) || []
        };
      });

      setOrders(formattedOrders);
    } catch (err) {
      console.error('Error in fetchOrders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      // Set empty orders array on error
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = async (orderData: Partial<Order>) => {
    try {
      // Start a transaction
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: orderData.customerId,
          customer_name: orderData.customerName,
          company_name: orderData.companyName,
          brand_name: orderData.brandName,
          variant: orderData.variant,
          description: orderData.description,
          quantity: orderData.quantity,
          price_per_unit: orderData.pricePerUnit,
          total_amount: orderData.totalAmount,
          estimated_delivery: orderData.estimatedDelivery,
          material_id: orderData.materialId,
          estimated_material_needed: orderData.estimatedMaterialNeeded,
          production_status: orderData.productionStatus || 'start',
          label_width: Math.round(Number(orderData.labelWidth)),
          label_height: Math.round(Number(orderData.labelHeight))
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Save order machines if any
      if (orderData.machines && orderData.machines.length > 0) {
        const { error: machinesError } = await supabase
          .from('order_machines')
          .insert(
            orderData.machines.map(machine => ({
              order_id: order.id,
              machine_id: machine.machineId,
              machine_name: machine.machineName,
              estimated_hours: machine.estimatedHours,
              status: machine.status
            }))
          );

        if (machinesError) throw machinesError;
      }
      
      await fetchOrders(); // Refresh the list
      return order;
    } catch (err) {
      console.error('Error adding order:', err);
      throw err;
    }
  };

  const updateOrder = async (id: string, orderData: Partial<Order>) => {
    try {
      // Update order
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          customer_id: orderData.customerId,
          customer_name: orderData.customerName,
          company_name: orderData.companyName,
          brand_name: orderData.brandName,
          variant: orderData.variant,
          description: orderData.description,
          quantity: orderData.quantity,
          price_per_unit: orderData.pricePerUnit,
          total_amount: orderData.totalAmount,
          status: orderData.status,
          production_status: orderData.productionStatus,
          estimated_delivery: orderData.estimatedDelivery,
          material_id: orderData.materialId,
          material_used: orderData.materialUsed,
          estimated_material_needed: orderData.estimatedMaterialNeeded,
          label_width: Math.round(Number(orderData.labelWidth)),
          label_height: Math.round(Number(orderData.labelHeight))
        })
        .eq('id', id);

      if (orderError) throw orderError;

      // Update order machines if provided
      if (orderData.machines) {
        // First, delete existing machines
        const { error: deleteError } = await supabase
          .from('order_machines')
          .delete()
          .eq('order_id', id);

        if (deleteError) throw deleteError;

        // Then, insert new machines
        if (orderData.machines.length > 0) {
          const { error: machinesError } = await supabase
            .from('order_machines')
            .insert(
              orderData.machines.map(machine => ({
                order_id: id,
                machine_id: machine.machineId,
                machine_name: machine.machineName,
                estimated_hours: machine.estimatedHours,
                status: machine.status
              }))
            );

          if (machinesError) throw machinesError;
        }
      }
      
      await fetchOrders(); // Refresh the list
    } catch (err) {
      console.error('Error updating order:', err);
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      // First, delete related order machines
      const { error: machinesError } = await supabase
        .from('order_machines')
        .delete()
        .eq('order_id', id);

      if (machinesError) throw machinesError;

      // Then delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (orderError) throw orderError;

      await fetchOrders(); // Refresh the list
    } catch (err) {
      console.error('Error deleting order:', err);
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrder,
    deleteOrder,
    refetch: fetchOrders
  };
};
