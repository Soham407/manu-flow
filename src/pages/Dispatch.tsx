import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';
import { format } from 'date-fns';

interface DispatchOrder extends Order {
  dispatchDate?: string;
  trackingNumber?: string;
  courierName?: string;
  dispatchStatus: 'pending' | 'in_transit' | 'delivered';
  dispatchNotes?: string;
}

const Dispatch = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<DispatchOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DispatchOrder | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // TODO: Replace with actual API call
        const mockOrders: DispatchOrder[] = [
          {
            id: '1',
            customerId: '1',
            customerName: 'ABC Company',
            description: 'Custom printed banners',
            quantity: 100,
            pricePerUnit: 50,
            totalAmount: 5000,
            status: 'completed',
            estimatedDelivery: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            dispatchStatus: 'pending',
            estimatedMaterialNeeded: 200,
          },
          // Add more mock orders as needed
        ];
        setOrders(mockOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDispatch = (order: DispatchOrder) => {
    setSelectedOrder(order);
    setShowDispatchModal(true);
  };

  const handleDispatchSubmit = async (dispatchDetails: {
    courierName: string;
    trackingNumber: string;
    dispatchNotes: string;
  }) => {
    if (!selectedOrder) return;

    try {
      // TODO: Replace with actual API call
      const updatedOrder: DispatchOrder = {
        ...selectedOrder,
        dispatchDate: new Date().toISOString(),
        dispatchStatus: 'in_transit',
        ...dispatchDetails,
      };

      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? updatedOrder : order
      ));
      setShowDispatchModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating dispatch:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dispatch</h1>
            <p className="text-gray-600">Manage order dispatch and delivery</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No orders ready for dispatch
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.dispatchStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.dispatchStatus === 'in_transit' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {order.dispatchStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDispatch(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Dispatch
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showDispatchModal && selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900">Dispatch Order</h3>
                <div className="mt-2 px-7 py-3">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleDispatchSubmit({
                      courierName: formData.get('courierName') as string,
                      trackingNumber: formData.get('trackingNumber') as string,
                      dispatchNotes: formData.get('dispatchNotes') as string,
                    });
                  }}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Courier Name
                      </label>
                      <input
                        type="text"
                        name="courierName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        name="trackingNumber"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Dispatch Notes
                      </label>
                      <textarea
                        name="dispatchNotes"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowDispatchModal(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Confirm Dispatch
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dispatch;
