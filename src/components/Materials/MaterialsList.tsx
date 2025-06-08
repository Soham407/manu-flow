import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMaterials } from '@/hooks/useMaterials';
import { Material } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Package, AlertTriangle, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import MaterialForm from './MaterialForm';

const MaterialsList = () => {
  const { user } = useAuth();
  const { materials, loading, error, addMaterial, updateMaterial, refetch } = useMaterials();
  const { toast } = useToast();

  const [isMaterialFormOpen, setIsMaterialFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStockStatus = (material: Material) => {
    if (material.currentStock <= material.minStockLevel) {
      return { status: 'Low Stock', color: 'bg-red-100 text-red-800' };
    } else if (material.currentStock <= material.minStockLevel * 1.5) {
      return { status: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'Good Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setIsMaterialFormOpen(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setIsMaterialFormOpen(true);
  };

  const handleSaveMaterial = async (materialData: Partial<Material>) => {
    try {
      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, materialData);
        toast({
          title: "Success",
          description: "Material updated successfully!",
        });
      } else {
        await addMaterial(materialData);
        toast({
          title: "Success",
          description: "Material added successfully!",
        });
      }
      setIsMaterialFormOpen(false);
    } catch (error) {
      console.error('Error saving material:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save material. Please try again.",
        variant: "destructive",
      });
    }
  };

  const canManageMaterials = user?.role === 'super_admin' || user?.role === 'admin';
  const totalValue = materials.reduce((sum, material) => sum + (material.currentStock * material.costPerMeter), 0);
  const lowStockCount = materials.filter(m => m.currentStock <= m.minStockLevel).length;

  const searchFilteredMaterials = materials.filter(material => {
    const searchLower = searchQuery.toLowerCase();
    return (
      material.name.toLowerCase().includes(searchLower) ||
      material.type.toLowerCase().includes(searchLower) ||
      material.supplier?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading materials: {error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Material Inventory</h2>
          <p className="text-sm text-gray-600">
            Track and manage factory material stock levels
          </p>
        </div>
        
        {canManageMaterials && (
          <Dialog open={isMaterialFormOpen} onOpenChange={setIsMaterialFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddMaterial} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg mx-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingMaterial ? 'Edit Material' : 'Add New Material'}
                </DialogTitle>
              </DialogHeader>
              <MaterialForm
                material={editingMaterial}
                onSave={handleSaveMaterial}
                onCancel={() => setIsMaterialFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold">{materials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600">Total Stock Value</p>
              <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600">Total Stock (Meters)</p>
              <p className="text-2xl font-bold">{materials.reduce((sum, m) => sum + m.currentStock, 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Material Stock ({searchFilteredMaterials.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search materials..."
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
                  <TableHead>Material Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead>Stock (Meters)</TableHead>
                  <TableHead className="hidden md:table-cell">Cost/Meter</TableHead>
                  <TableHead>Status</TableHead>
                  {canManageMaterials && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchFilteredMaterials.map((material) => {
                  const stockStatus = getStockStatus(material);
                  return (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-gray-500 sm:hidden">{material.type}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{material.type}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{material.currentStock}</div>
                          <div className="text-sm text-gray-500">Min: {material.minStockLevel}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">₹{material.costPerMeter}</TableCell>
                      <TableCell>
                        <Badge className={stockStatus.color}>
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      {canManageMaterials && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMaterial(material)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsList;
