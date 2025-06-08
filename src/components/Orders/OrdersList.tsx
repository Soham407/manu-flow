import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useCustomers } from '@/hooks/useCustomers';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, Loader2, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import OrderForm from './OrderForm';
import OrderDetails from './OrderDetails';

const OrdersList = () => {
  const { user } = useAuth();
  const { orders, loading: ordersLoading, addOrder, updateOrder, deleteOrder } = useOrders();
  const { customers } = useCustomers();
  const { toast } = useToast();
  
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_production: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      dispatched: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setIsOrderFormOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsOrderFormOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleSaveOrder = async (orderData: Partial<Order>) => {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, orderData);
      } else {
        await addOrder(orderData);
      }
      setIsOrderFormOpen(false);
    } catch (error) {
      console.error('Error saving order:', error);
      // You could add a toast notification here
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    try {
      await deleteOrder(order.id);
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = user?.role === 'customer' 
    ? orders.filter(order => !order.isHidden)
    : orders;

  const searchFilteredOrders = filteredOrders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower) ||
      order.description.toLowerCase().includes(searchLower) ||
      order.companyName?.toLowerCase().includes(searchLower) ||
      order.brandName?.toLowerCase().includes(searchLower)
    );
  });

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {user?.role === 'customer' ? 'My Orders' : 'Orders Management'}
          </h2>
          <p className="text-sm text-gray-600">
            {user?.role === 'customer' ? 'Track your order status and history' : 'Manage customer orders and production requests'}
          </p>
        </div>
        
        {user?.role !== 'customer' && (
          <Dialog open={isOrderFormOpen} onOpenChange={setIsOrderFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddOrder} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
              <DialogHeader className="px-6 py-4 border-b">
                <DialogTitle className="text-lg font-semibold">
                  {editingOrder ? 'Edit Order' : 'Create New Order'}
                </DialogTitle>
              </DialogHeader>
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                <OrderForm
                  order={editingOrder}
                  customers={customers}
                  onSave={handleSaveOrder}
                  onCancel={() => setIsOrderFormOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Orders List ({searchFilteredOrders.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Quantity</TableHead>
                  <TableHead>W x H</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchFilteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">#{order.id.slice(0, 8)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="max-w-[200px] truncate">{order.description}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.quantity}</TableCell>
                    <TableCell>
                      {order.labelWidth && order.labelHeight ? 
                        `${order.labelWidth} x ${order.labelHeight}` : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>₹{(order.totalAmount || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status || 'pending')}>
                        {(order.status || 'pending').replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {user?.role !== 'customer' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOrder(order)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl mx-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetails 
              order={selectedOrder} 
              onClose={() => setIsDetailsOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersList;
