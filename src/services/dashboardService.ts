import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalOrders?: number;
  activeJobs?: number;
  monthlyRevenue?: number;
  totalUsers?: number;
  pendingInvoices?: number;
  outstandingAmount?: number;
  paymentsReceived?: number;
  activeCustomers?: number;
  pendingTasks?: number;
  completedToday?: number;
  issuesDelays?: number;
  readyToDispatch?: number;
  dispatchedToday?: number;
  pendingDeliveries?: number;
  totalDispatched?: number;
  myActiveTasks?: number;
  myCompletedToday?: number;
  totalHours?: number;
  tasksThisWeek?: number;
  activeOrders?: number;
  accountBalance?: number;
}

export const getDashboardStats = async (userId: string, role: string): Promise<DashboardStats> => {
  const stats: DashboardStats = {};

  try {
    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get active jobs
    const { count: activeJobs } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in_production');

    // Get monthly revenue
    const { data: monthlyPayments } = await supabase
      .from('payments')
      .select('amount')
      .gte('createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    const monthlyRevenue = monthlyPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get pending invoices
    const { count: pendingInvoices } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get outstanding amount
    const { data: outstandingInvoices } = await supabase
      .from('invoices')
      .select('amount')
      .in('status', ['pending', 'overdue']);

    const outstandingAmount = outstandingInvoices?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0;

    // Get active customers
    const { count: activeCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Get pending tasks
    const { count: pendingTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get completed tasks today
    const today = new Date().toISOString().split('T')[0];
    const { count: completedToday } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('completedAt', today);

    // Get issues/delays
    const { count: issuesDelays } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'on_hold');

    // Get ready to dispatch
    const { count: readyToDispatch } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .is('dispatchedAt', null);

    // Get dispatched today
    const { count: dispatchedToday } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'dispatched')
      .gte('dispatchedAt', today);

    // Get pending deliveries
    const { count: pendingDeliveries } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'dispatched')
      .is('deliveredAt', null);

    // Get total dispatched
    const { count: totalDispatched } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'dispatched');

    // Get worker specific stats
    if (role === 'worker') {
      const { count: myActiveTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assignedTo', userId)
        .eq('status', 'in_progress');

      const { count: myCompletedToday } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assignedTo', userId)
        .eq('status', 'completed')
        .gte('completedAt', today);

      // Get total hours for the week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const { data: weeklyTasks } = await supabase
        .from('tasks')
        .select('timeSpent')
        .eq('assignedTo', userId)
        .gte('completedAt', weekStart.toISOString());

      const totalHours = weeklyTasks?.reduce((sum, task) => sum + (task.timeSpent || 0), 0) || 0;

      // Get tasks this week
      const { count: tasksThisWeek } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assignedTo', userId)
        .gte('createdAt', weekStart.toISOString());

      stats.myActiveTasks = myActiveTasks;
      stats.myCompletedToday = myCompletedToday;
      stats.totalHours = totalHours;
      stats.tasksThisWeek = tasksThisWeek;
    }

    // Get customer specific stats
    if (role === 'customer') {
      const { count: activeOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('customerId', userId)
        .in('status', ['pending', 'in_production']);

      const { count: customerPendingInvoices } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('customerId', userId)
        .eq('status', 'pending');

      const { data: customerData } = await supabase
        .from('customers')
        .select('balance')
        .eq('id', userId)
        .single();

      stats.activeOrders = activeOrders;
      stats.pendingInvoices = customerPendingInvoices;
      stats.accountBalance = customerData?.balance || 0;
    }

    return {
      totalOrders,
      activeJobs,
      monthlyRevenue,
      totalUsers,
      pendingInvoices,
      outstandingAmount,
      activeCustomers,
      pendingTasks,
      completedToday,
      issuesDelays,
      readyToDispatch,
      dispatchedToday,
      pendingDeliveries,
      totalDispatched,
      ...stats
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 