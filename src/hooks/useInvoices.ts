import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Invoice } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is a customer, only fetch their invoices
      if (user?.role === 'customer') {
        query = query.eq('customer_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedInvoices: Invoice[] = data.map(invoice => ({
        id: invoice.id,
        customerId: invoice.customer_id,
        customerName: invoice.customer_name,
        orderId: invoice.order_id,
        amount: Number(invoice.amount),
        status: invoice.status,
        dueDate: invoice.due_date,
        createdAt: invoice.created_at,
        isHidden: invoice.is_hidden
      }));

      setInvoices(formattedInvoices);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user?.id]); // Refetch when user ID changes

  const addInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      const { data: invoiceResult, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          customer_id: invoiceData.customerId,
          customer_name: invoiceData.customerName,
          order_id: invoiceData.orderId,
          amount: invoiceData.amount,
          status: invoiceData.status || 'pending',
          due_date: invoiceData.dueDate,
          is_hidden: invoiceData.isHidden || false
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;
      
      await fetchInvoices(); // Refresh the list
      return invoiceResult;
    } catch (err) {
      console.error('Error adding invoice:', err);
      throw err;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          customer_id: invoiceData.customerId,
          customer_name: invoiceData.customerName,
          order_id: invoiceData.orderId,
          amount: invoiceData.amount,
          status: invoiceData.status,
          due_date: invoiceData.dueDate,
          is_hidden: invoiceData.isHidden
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchInvoices(); // Refresh the list
    } catch (err) {
      console.error('Error updating invoice:', err);
      throw err;
    }
  };

  return {
    invoices,
    loading,
    error,
    addInvoice,
    updateInvoice,
    refetch: fetchInvoices
  };
};
