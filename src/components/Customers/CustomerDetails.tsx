import React from 'react';
import { Customer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building, Package, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

interface CustomerDetailsProps {
  customer: Customer;
  onClose: () => void;
  onEdit: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onClose, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <span className="text-sm">{customer.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Financial Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className={`text-lg font-semibold ${customer.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{customer.balance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Advance Deposit</p>
              <p className="text-lg font-semibold text-blue-600">
                ₹{customer.advanceDeposit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Since</p>
              <p className="text-sm">{new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Companies & Brands ({customer.companies.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {customer.companies.map((company) => (
              <div key={company.id} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>{company.name}</span>
                  <Badge variant="outline">{company.brands.length} Brands</Badge>
                </h4>
                
                <div className="space-y-3">
                  {company.brands.map((brand) => (
                    <div key={brand.id} className="ml-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{brand.name}</span>
                        <Badge variant="secondary">{brand.variants.length} Variants</Badge>
                      </div>
                      
                      <div className="ml-6">
                        <p className="text-sm text-gray-600 mb-1">Variants:</p>
                        <div className="flex flex-wrap gap-1">
                          {brand.variants.map((variant, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {variant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-2 pt-4">
        <Button onClick={onEdit} variant="outline" className="flex-1">
          Edit Customer
        </Button>
        <Button onClick={onClose} className="flex-1">
          Close
        </Button>
      </div>
    </div>
  );
};

export default CustomerDetails;
