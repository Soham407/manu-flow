import React, { useState } from 'react';
import { Order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, User, Ruler, Building2, Tag, Layers, Copy } from 'lucide-react';
import { useMaterials } from '@/hooks/useMaterials';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  const { materials } = useMaterials();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();
  const selectedMaterial = materials.find(m => m.id === order.materialId);
  const [isRepeatDialogOpen, setIsRepeatDialogOpen] = useState(false);
  const [repeatOrderData, setRepeatOrderData] = useState({
    quantity: order.quantity,
    pricePerUnit: order.pricePerUnit,
    estimatedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: order.description
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_production: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      dispatched: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleRepeatOrder = () => {
    setIsRepeatDialogOpen(true);
  };

  const handleConfirmRepeat = async () => {
    try {
      // Create a new order object based on the current order
      const newOrder = {
        ...order,
        id: undefined, // Let the database generate a new ID
        status: 'pending' as const,
        productionStatus: 'start' as const,
        createdAt: new Date().toISOString(),
        quantity: repeatOrderData.quantity,
        pricePerUnit: repeatOrderData.pricePerUnit,
        totalAmount: repeatOrderData.quantity * repeatOrderData.pricePerUnit,
        estimatedDelivery: repeatOrderData.estimatedDelivery,
        description: repeatOrderData.description,
        materialUsed: 0, // Reset material used
        machines: order.machines?.map(machine => ({
          ...machine,
          id: undefined, // Let the database generate new IDs
          status: 'scheduled' as const
        }))
      };

      // Remove the id field to let the database generate a new one
      const { id, ...orderData } = newOrder;

      // Add the new order
      await addOrder(orderData);
      
      toast({
        title: "Success",
        description: "Order has been repeated successfully",
      });

      // Close the dialogs and refresh the orders list
      setIsRepeatDialogOpen(false);
      onClose();
      navigate('/orders');
    } catch (error) {
      console.error('Error repeating order:', error);
      toast({
        title: "Error",
        description: "Failed to repeat order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-start space-x-2">
              <User className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
            </div>

            {order.companyName && (
              <div className="flex items-start space-x-2">
                <Building2 className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{order.companyName}</p>
                </div>
              </div>
            )}

            {order.brandName && (
              <div className="flex items-start space-x-2">
                <Tag className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-medium">{order.brandName}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <Calendar className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <DollarSign className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">₹{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            {order.variant && (
              <div className="flex items-start space-x-2">
                <Layers className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Variant</p>
                  <p className="font-medium">{order.variant}</p>
                </div>
              </div>
            )}

            {order.labelWidth && (
              <div className="flex items-start space-x-2">
                <Ruler className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Width</p>
                  <p className="font-medium">{order.labelWidth}mm</p>
                </div>
              </div>
            )}

            {order.labelHeight && (
              <div className="flex items-start space-x-2">
                <Ruler className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Length</p>
                  <p className="font-medium">{order.labelHeight}mm</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-2">Status</p>
            <Badge className={getStatusColor(order.status)}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <Button
            onClick={handleRepeatOrder}
            variant="default"
            className="flex items-center gap-2 bg-black hover:bg-gray-800"
          >
            <Copy className="h-4 w-4" />
            Repeat Order
          </Button>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-500 mb-2">Description</p>
        <p className="bg-gray-50 p-3 rounded-lg">{order.description}</p>
      </div>

      {/* Material Information */}
      {selectedMaterial && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Material</p>
              <p className="font-medium">{selectedMaterial.name}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Estimated Material Needed</p>
              <p className="font-medium">{order.estimatedMaterialNeeded}m</p>
            </div>
            {order.materialUsed !== undefined && (
              <div>
                <p className="text-sm text-gray-500">Material Used</p>
                <p className="font-medium">{order.materialUsed}m</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">Quantity</p>
          <p className="font-medium">{order.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Price per Unit</p>
          <p className="font-medium">₹{order.pricePerUnit}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-medium">₹{order.totalAmount.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="pt-4">
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>

      {/* Repeat Order Dialog */}
      <Dialog open={isRepeatDialogOpen} onOpenChange={setIsRepeatDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Repeat Order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={repeatOrderData.quantity}
                onChange={(e) => setRepeatOrderData(prev => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 0
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price/Unit
              </Label>
              <Input
                id="price"
                type="number"
                value={repeatOrderData.pricePerUnit}
                onChange={(e) => setRepeatOrderData(prev => ({
                  ...prev,
                  pricePerUnit: parseFloat(e.target.value) || 0
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="delivery" className="text-right">
                Delivery
              </Label>
              <DatePicker
                id="delivery"
                value={dayjs(repeatOrderData.estimatedDelivery)}
                onChange={(date) => setRepeatOrderData(prev => ({
                  ...prev,
                  estimatedDelivery: date?.toISOString() || prev.estimatedDelivery
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={repeatOrderData.description}
                onChange={(e) => setRepeatOrderData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRepeatDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRepeat}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetails;
