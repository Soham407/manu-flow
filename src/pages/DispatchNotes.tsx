import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Search, Plus, FileText, Download, Printer, Eye } from 'lucide-react';

interface DispatchNote {
  id: string;
  orderId: string;
  customerName: string;
  dispatchDate: string;
  challanNumber: string;
  courierName: string;
  trackingNumber: string;
  status: 'draft' | 'issued' | 'delivered';
  notes: string;
  items: DispatchItem[];
  createdAt: string;
  createdBy: string;
}

interface DispatchItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
}

const DispatchNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<DispatchNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<DispatchNote | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // TODO: Replace with actual API call
        const mockNotes: DispatchNote[] = [
          {
            id: '1',
            orderId: 'ORD-001',
            customerName: 'ABC Company',
            dispatchDate: new Date().toISOString(),
            challanNumber: 'CH-001',
            courierName: 'Fast Delivery',
            trackingNumber: 'TRK123456',
            status: 'issued',
            notes: 'Handle with care - Fragile items',
            items: [
              { id: '1', description: 'Custom Printed Banners', quantity: 10, unit: 'pcs' },
              { id: '2', description: 'Vinyl Stickers', quantity: 50, unit: 'pcs' }
            ],
            createdAt: new Date().toISOString(),
            createdBy: 'John Doe'
          },
          // Add more mock notes as needed
        ];
        setNotes(mockNotes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dispatch notes:', error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleCreateNote = async (noteData: Omit<DispatchNote, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      // TODO: Replace with actual API call
      const newNote: DispatchNote = {
        ...noteData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        createdBy: user?.name || 'Unknown'
      };
      setNotes([newNote, ...notes]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating dispatch note:', error);
    }
  };

  const handlePrintNote = (note: DispatchNote) => {
    // TODO: Implement print functionality
    console.log('Printing note:', note);
  };

  const handleDownloadNote = (note: DispatchNote) => {
    // TODO: Implement download functionality
    console.log('Downloading note:', note);
  };

  const filteredNotes = notes.filter(note => 
    note.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.challanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dispatch Notes</h1>
            <p className="text-gray-600">Manage delivery challans and dispatch documentation</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Dispatch Note
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by customer, challan number, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Challan No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispatch Date
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
                ) : filteredNotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No dispatch notes found
                    </td>
                  </tr>
                ) : (
                  filteredNotes.map((note) => (
                    <tr key={note.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {note.challanNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {note.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {note.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(note.dispatchDate), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${note.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                            note.status === 'issued' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {note.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setSelectedNote(note);
                              setShowViewModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePrintNote(note)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Print"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadNote(note)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Dispatch Note</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleCreateNote({
                    orderId: formData.get('orderId') as string,
                    customerName: formData.get('customerName') as string,
                    dispatchDate: new Date().toISOString(),
                    challanNumber: formData.get('challanNumber') as string,
                    courierName: formData.get('courierName') as string,
                    trackingNumber: formData.get('trackingNumber') as string,
                    status: 'draft',
                    notes: formData.get('notes') as string,
                    items: [
                      {
                        id: '1',
                        description: formData.get('itemDescription') as string,
                        quantity: Number(formData.get('itemQuantity')),
                        unit: formData.get('itemUnit') as string
                      }
                    ]
                  });
                }}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Order ID
                      </label>
                      <input
                        type="text"
                        name="orderId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Challan Number
                      </label>
                      <input
                        type="text"
                        name="challanNumber"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div>
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
                      Item Description
                    </label>
                    <input
                      type="text"
                      name="itemDescription"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="itemQuantity"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Unit
                      </label>
                      <input
                        type="text"
                        name="itemUnit"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Create Note
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showViewModal && selectedNote && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dispatch Note Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Challan Number</p>
                      <p className="mt-1">{selectedNote.challanNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order ID</p>
                      <p className="mt-1">{selectedNote.orderId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Customer</p>
                      <p className="mt-1">{selectedNote.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dispatch Date</p>
                      <p className="mt-1">{format(new Date(selectedNote.dispatchDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Courier</p>
                      <p className="mt-1">{selectedNote.courierName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                      <p className="mt-1">{selectedNote.trackingNumber}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Items</p>
                    <div className="mt-2 border rounded">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedNote.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {selectedNote.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notes</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedNote.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handlePrintNote(selectedNote)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatchNotes;
