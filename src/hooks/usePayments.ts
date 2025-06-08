import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Payment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is a customer, only fetch their payments
      if (user?.role === 'customer') {
        query = query.eq('customer_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedPayments: Payment[] = data.map(payment => ({
        id: payment.id,
        customerId: payment.customer_id,
        invoiceId: payment.invoice_id,
        amount: Number(payment.amount),
        type: payment.type,
        method: payment.method,
        reference: payment.reference,
        createdAt: payment.created_at,
        isHidden: payment.is_hidden
      }));

      setPayments(formattedPayments);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user?.id]); // Refetch when user ID changes

  const addPayment = async (paymentData: Partial<Payment>) => {
    try {
      const { data: paymentResult, error: paymentError } = await supabase
        .from('payments')
        .insert({
          customer_id: paymentData.customerId,
          invoice_id: paymentData.invoiceId,
          amount: paymentData.amount,
          type: paymentData.type || 'advance',
          method: paymentData.method || 'cash',
          reference: paymentData.reference,
          is_hidden: paymentData.isHidden || false
        })
        .select()
        .single();

      if (paymentError) throw paymentError;
      
      await fetchPayments(); // Refresh the list
      return paymentResult;
    } catch (err) {
      console.error('Error adding payment:', err);
      throw err;
    }
  };

  const updatePayment = async (id: string, paymentData: Partial<Payment>) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          customer_id: paymentData.customerId,
          invoice_id: paymentData.invoiceId,
          amount: paymentData.amount,
          type: paymentData.type,
          method: paymentData.method,
          reference: paymentData.reference,
          is_hidden: paymentData.isHidden
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchPayments(); // Refresh the list
    } catch (err) {
      console.error('Error updating payment:', err);
      throw err;
    }
  };

  return {
    payments,
    loading,
    error,
    addPayment,
    updatePayment,
    refetch: fetchPayments
  };
};
