import React, { useState, useEffect } from 'react';
import { Order, Customer, OrderMachine, Company, Brand } from '@/types';
import { useMaterials } from '@/hooks/useMaterials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import RequiredMachinesList from './RequiredMachinesList';
import ProductionSchedule from './ProductionSchedule';

dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DD';

interface OrderFormProps {
  order?: Order | null;
  customers: Customer[];
  onSave: (order: Partial<Order>) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  customers,
  onSave,
  onCancel
}) => {
  const { materials } = useMaterials();
  const [currentTab, setCurrentTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    customerId: order?.customerId || '',
    customerName: order?.customerName || '',
    companyName: order?.companyName || '',
    brandName: order?.brandName || '',
    variant: order?.variant || '',
    description: order?.description || '',
    quantity: order?.quantity || 0,
    pricePerUnit: order?.pricePerUnit || 0,
    estimatedDelivery: order?.estimatedDelivery || '',
    materialId: order?.materialId || '',
    estimatedMaterialNeeded: order?.estimatedMaterialNeeded || 0,
    labelWidth: order?.labelWidth || 0,
    labelHeight: order?.labelHeight || 0
  });

  // Add state for numeric input values
  const [quantityInputValue, setQuantityInputValue] = useState(formData.quantity.toString());
  const [priceInputValue, setPriceInputValue] = useState(formData.pricePerUnit.toString());
  const [materialInputValue, setMaterialInputValue] = useState(formData.estimatedMaterialNeeded.toString());
  const [labelWidthInputValue, setLabelWidthInputValue] = useState(formData.labelWidth.toString());
  const [labelHeightInputValue, setLabelHeightInputValue] = useState(formData.labelHeight.toString());

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    customers.find(c => c.id === formData.customerId) || null
  );
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    selectedCustomer?.companies.find(c => c.name === formData.companyName) || null
  );
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(
    selectedCompany?.brands.find(b => b.name === formData.brandName) || null
  );
  const [selectedMachines, setSelectedMachines] = useState<OrderMachine[]>(
    order?.machines || []
  );

  // Initialize company and brand selections when editing an order
  useEffect(() => {
    if (order && selectedCustomer) {
      const company = selectedCustomer.companies.find(c => c.name === order.companyName);
      if (company) {
        setSelectedCompany(company);
        const brand = company.brands.find(b => b.name === order.brandName);
        if (brand) {
          setSelectedBrand(brand);
        }
      }
    }
  }, [order, selectedCustomer]);

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
    
    // Only reset company, brand, and variant if this is a new order
    if (!order) {
      setSelectedCompany(null);
      setSelectedBrand(null);
      setFormData(prev => ({
        ...prev,
        customerId,
        customerName: customer?.name || '',
        companyName: '',
        brandName: '',
        variant: ''
      }));
    } else {
      // For existing orders, just update the customer info
      setFormData(prev => ({
        ...prev,
        customerId,
        customerName: customer?.name || ''
      }));
    }
  };

  const handleCompanyChange = (companyId: string) => {
    if (!selectedCustomer) return;
    const company = selectedCustomer.companies.find(c => c.id === companyId);
    setSelectedCompany(company || null);
    
    if (!order) {
      setSelectedBrand(null);
      setFormData(prev => ({
        ...prev,
        companyName: company?.name || '',
        brandName: '',
        variant: ''
      }));
    } else {
      // For existing orders, only update if the company actually changed
      if (company?.name !== order.companyName) {
        setSelectedBrand(null);
        setFormData(prev => ({
          ...prev,
          companyName: company?.name || '',
          brandName: '',
          variant: ''
        }));
      }
    }
  };

  const handleBrandChange = (brandId: string) => {
    if (!selectedCompany) return;
    const brand = selectedCompany.brands.find(b => b.id === brandId);
    setSelectedBrand(brand || null);
    
    if (!order) {
      setFormData(prev => ({
        ...prev,
        brandName: brand?.name || '',
        variant: ''
      }));
    } else {
      // For existing orders, only update if the brand actually changed
      if (brand?.name !== order.brandName) {
        setFormData(prev => ({
          ...prev,
          brandName: brand?.name || '',
          variant: ''
        }));
      }
    }
  };

  const handleVariantChange = (variant: string) => {
    setFormData(prev => ({
      ...prev,
      variant
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      totalAmount: formData.quantity * formData.pricePerUnit,
      productionStatus: 'start',
      machines: selectedMachines
    });
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isBasicInfoValid()) {
      setCurrentTab('machines');
    }
  };

  const handleChange = (field: string, value: string | number) => {
    // Remove leading zeros for numeric fields
    if (typeof value === 'string' && ['quantity', 'pricePerUnit', 'estimatedMaterialNeeded'].includes(field)) {
      value = value.replace(/^0+/, '') || '0';
      // Convert to number for state update
      value = field === 'pricePerUnit' ? parseFloat(value) || 0 : parseInt(value) || 0;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumericFocus = (field: string) => {
    switch (field) {
      case 'quantity':
        setQuantityInputValue(formData.quantity === 0 ? '' : formData.quantity.toString());
        break;
      case 'pricePerUnit':
        setPriceInputValue(formData.pricePerUnit === 0 ? '' : formData.pricePerUnit.toString());
        break;
      case 'estimatedMaterialNeeded':
        setMaterialInputValue(formData.estimatedMaterialNeeded === 0 ? '' : formData.estimatedMaterialNeeded.toString());
        break;
      case 'labelWidth':
        setLabelWidthInputValue(formData.labelWidth === 0 ? '' : formData.labelWidth.toString());
        break;
      case 'labelHeight':
        setLabelHeightInputValue(formData.labelHeight === 0 ? '' : formData.labelHeight.toString());
        break;
    }
  };

  const handleNumericBlur = (field: string, value: string) => {
    const trimmedValue = value.trim();
    let numValue = 0;
    
    if (trimmedValue !== '') {
      // For label dimensions, ensure we're using integers
      if (field === 'labelWidth' || field === 'labelHeight') {
        numValue = Math.round(parseFloat(trimmedValue)) || 0;
      } else {
        numValue = field === 'pricePerUnit' ? parseFloat(trimmedValue) || 0 : parseInt(trimmedValue) || 0;
      }
    }

    switch (field) {
      case 'quantity':
        setQuantityInputValue(numValue.toString());
        handleChange('quantity', numValue);
        break;
      case 'pricePerUnit':
        setPriceInputValue(numValue.toString());
        handleChange('pricePerUnit', numValue);
        break;
      case 'estimatedMaterialNeeded':
        setMaterialInputValue(numValue.toString());
        handleChange('estimatedMaterialNeeded', numValue);
        break;
      case 'labelWidth':
        setLabelWidthInputValue(numValue.toString());
        handleChange('labelWidth', numValue);
        break;
      case 'labelHeight':
        setLabelHeightInputValue(numValue.toString());
        handleChange('labelHeight', numValue);
        break;
    }
  };

  const handleNumericChange = (field: string, value: string) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    switch (field) {
      case 'quantity':
        setQuantityInputValue(numericValue);
        break;
      case 'pricePerUnit':
        setPriceInputValue(numericValue);
        break;
      case 'estimatedMaterialNeeded':
        setMaterialInputValue(numericValue);
        break;
      case 'labelWidth':
        setLabelWidthInputValue(numericValue);
        break;
      case 'labelHeight':
        setLabelHeightInputValue(numericValue);
        break;
    }
  };

  const isBasicInfoValid = () => {
    return (
      formData.customerId &&
      formData.companyName &&
      formData.brandName &&
      formData.variant &&
      formData.description &&
      formData.quantity > 0 &&
      formData.pricePerUnit > 0 &&
      formData.materialId &&
      formData.estimatedMaterialNeeded > 0 &&
      formData.estimatedDelivery
    );
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="machines" disabled={!isBasicInfoValid()}>Required Machines</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* Customer, Company, Brand, Variant Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Selection */}
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-sm font-medium">Customer</Label>
                <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                <Select 
                  value={selectedCompany?.id || ''} 
                  onValueChange={handleCompanyChange}
                  disabled={!selectedCustomer}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCustomer?.companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Selection */}
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
                <Select 
                  value={selectedBrand?.id || ''} 
                  onValueChange={handleBrandChange}
                  disabled={!selectedCompany}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCompany?.brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Variant Selection */}
              <div className="space-y-2">
                <Label htmlFor="variant" className="text-sm font-medium">Variant</Label>
                <Select 
                  value={formData.variant} 
                  onValueChange={handleVariantChange}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBrand?.variants.map((variant, index) => (
                      <SelectItem key={index} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Label Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="labelWidth" className="text-sm font-medium">Label Width (mm)</Label>
                <Input
                  id="labelWidth"
                  type="number"
                  step="1"
                  value={labelWidthInputValue}
                  onChange={(e) => handleNumericChange('labelWidth', e.target.value)}
                  onFocus={() => handleNumericFocus('labelWidth')}
                  onBlur={(e) => handleNumericBlur('labelWidth', e.target.value)}
                  required
                  min="0"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="labelHeight" className="text-sm font-medium">Label Height (mm)</Label>
                <Input
                  id="labelHeight"
                  type="number"
                  step="1"
                  value={labelHeightInputValue}
                  onChange={(e) => handleNumericChange('labelHeight', e.target.value)}
                  onFocus={() => handleNumericFocus('labelHeight')}
                  onBlur={(e) => handleNumericBlur('labelHeight', e.target.value)}
                  required
                  min="0"
                  className="h-10"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Quantity and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantityInputValue}
                  onChange={(e) => handleNumericChange('quantity', e.target.value)}
                  onFocus={() => handleNumericFocus('quantity')}
                  onBlur={(e) => handleNumericBlur('quantity', e.target.value)}
                  required
                  min="1"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit" className="text-sm font-medium">Price per Unit (₹)</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  value={priceInputValue}
                  onChange={(e) => handleNumericChange('pricePerUnit', e.target.value)}
                  onFocus={() => handleNumericFocus('pricePerUnit')}
                  onBlur={(e) => handleNumericBlur('pricePerUnit', e.target.value)}
                  required
                  min="0"
                  className="h-10"
                />
              </div>
            </div>

            {/* Material and Estimated Material Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material" className="text-sm font-medium">Material</Label>
                <Select value={formData.materialId} onValueChange={(value) => handleChange('materialId', value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.currentStock}m available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedMaterialNeeded" className="text-sm font-medium">Est. Material Needed (m)</Label>
                <Input
                  id="estimatedMaterialNeeded"
                  type="number"
                  value={materialInputValue}
                  onChange={(e) => handleNumericChange('estimatedMaterialNeeded', e.target.value)}
                  onFocus={() => handleNumericFocus('estimatedMaterialNeeded')}
                  onBlur={(e) => handleNumericBlur('estimatedMaterialNeeded', e.target.value)}
                  required
                  min="0"
                  className="h-10"
                />
              </div>
            </div>

            {/* Delivery Date */}
            <div className="space-y-2">
              <Label htmlFor="estimatedDelivery" className="text-sm font-medium">Estimated Delivery</Label>
              <DatePicker
                id="estimatedDelivery"
                value={formData.estimatedDelivery ? dayjs(formData.estimatedDelivery, dateFormat) : null}
                onChange={(date) => handleChange('estimatedDelivery', date ? date.format(dateFormat) : '')}
                format={dateFormat}
                className="w-full h-10"
                minDate={dayjs()}
                required
              />
            </div>
          </TabsContent>

          <TabsContent value="machines" className="space-y-4">
            <RequiredMachinesList 
              selectedMachines={selectedMachines}
              onMachinesChange={setSelectedMachines}
            />
            {selectedMachines.length > 0 && (
              <ProductionSchedule selectedMachines={selectedMachines} />
            )}
          </TabsContent>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {currentTab === 'basic' ? (
              <>
                <Button 
                  type="button" 
                  className="flex-1 h-10"
                  onClick={handleNext}
                  disabled={!isBasicInfoValid()}
                >
                  Next
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-10">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" className="flex-1 h-10">
                  {order ? 'Update Order' : 'Create Order'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-10">
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Tabs>
      </form>
    </div>
  );
};

export default OrderForm;
