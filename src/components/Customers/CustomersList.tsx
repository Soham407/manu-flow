import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Users, Building, Package, Edit, Loader2, Trash2, EyeOff, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomerDetails from './CustomerDetails';
import CustomerForm from './CustomerForm';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CustomersList = () => {
  const { user } = useAuth();
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer, toggleCustomerVisibility } = useCustomers();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const isSuperAdmin = user?.roles?.includes('super_admin');

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditCustomerOpen(true);
  };

  const handleRowClick = (customer: Customer) => {
    handleViewCustomer(customer);
  };

  const handleAddCustomer = () => {
    setIsAddCustomerOpen(true);
  };

  const handleSaveCustomer = async (customerData: Partial<Customer>) => {
    try {
      await addCustomer(customerData);
      setIsAddCustomerOpen(false);
      toast({
        title: "Success",
        description: "Customer added successfully!",
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCustomer = async (customerData: Partial<Customer>) => {
    if (!editingCustomer) return;
    
    try {
      await updateCustomer(editingCustomer.id, customerData);
      setIsEditCustomerOpen(false);
      setEditingCustomer(null);
      toast({
        title: "Success",
        description: "Customer updated successfully!",
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      await deleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
      toast({
        title: "Success",
        description: "Customer deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleVisibility = async (customer: Customer) => {
    try {
      await toggleCustomerVisibility(customer.id);
      toast({
        title: "Success",
        description: `Customer ${customer.is_hidden ? 'shown' : 'hidden'} successfully!`,
      });
    } catch (error) {
      console.error('Error toggling customer visibility:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle customer visibility. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalCompanies = customers.reduce((sum, customer) => sum + customer.companies.length, 0);
  const totalBrands = customers.reduce((sum, customer) => 
    sum + customer.companies.reduce((brandSum, company) => brandSum + company.brands.length, 0), 0
  );

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower) ||
      customer.companies.some(company => 
        company.name.toLowerCase().includes(searchLower)
      )
    );
  });

  if (loading) {
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-sm text-gray-600">
            Manage customer accounts, companies, and brand relationships
          </p>
        </div>
        
        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCustomer} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm
              onSave={handleSaveCustomer}
              onCancel={() => setIsAddCustomerOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
          <DialogContent className="max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm
              customer={editingCustomer}
              onSave={handleUpdateCustomer}
              onCancel={() => {
                setIsEditCustomerOpen(false);
                setEditingCustomer(null);
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            {selectedCustomer && (
              <CustomerDetails
                customer={selectedCustomer}
                onClose={() => setIsDetailsOpen(false)}
                onEdit={() => {
                  setIsDetailsOpen(false);
                  handleEditCustomer(selectedCustomer);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!customerToDelete} onOpenChange={() => setCustomerToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the customer
                and all associated companies and brands.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCustomer}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold">{totalCompanies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Brands</p>
                <p className="text-2xl font-bold">{totalBrands}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold">
                ₹{customers.reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Customer List ({filteredCustomers.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customers..."
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
                  <TableHead>Customer Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Companies</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(customer)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500 sm:hidden">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="text-sm">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">
                        {customer.companies.length} Companies
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={customer.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ₹{customer.balance.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCustomer(customer);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCustomer(customer);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVisibility(customer);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <EyeOff className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomerToDelete(customer);
                          }}
                          className="h-8 w-8 p-0 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersList;
