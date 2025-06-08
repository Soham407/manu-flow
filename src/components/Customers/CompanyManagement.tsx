import React, { useState } from 'react';
import { Company, Brand } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Save } from 'lucide-react';

interface CompanyManagementProps {
  companies: Company[];
  onCompaniesChange: (companies: Company[]) => void;
}

const CompanyManagement: React.FC<CompanyManagementProps> = ({
  companies,
  onCompaniesChange
}) => {
  const [newCompanyName, setNewCompanyName] = useState('');
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [newVariant, setNewVariant] = useState('');
  const [activeBrandForVariant, setActiveBrandForVariant] = useState<string | null>(null);

  const addCompany = () => {
    if (!newCompanyName.trim()) return;
    
    const newCompany: Company = {
      id: `temp-company-${Date.now()}`, // Temporary ID for UI state management
      name: newCompanyName.trim(),
      brands: []
    };
    
    onCompaniesChange([...companies, newCompany]);
    setNewCompanyName('');
  };

  const updateCompanyName = (companyId: string, newName: string) => {
    const updatedCompanies = companies.map(company =>
      company.id === companyId ? { ...company, name: newName } : company
    );
    onCompaniesChange(updatedCompanies);
    setEditingCompany(null);
  };

  const deleteCompany = (companyId: string) => {
    onCompaniesChange(companies.filter(company => company.id !== companyId));
  };

  const addBrand = (companyId: string) => {
    if (!newBrandName.trim()) return;

    const newBrand: Brand = {
      id: `temp-brand-${Date.now()}`, // Temporary ID for UI state management
      name: newBrandName.trim(),
      variants: []
    };

    const updatedCompanies = companies.map(company =>
      company.id === companyId
        ? { ...company, brands: [...company.brands, newBrand] }
        : company
    );
    
    onCompaniesChange(updatedCompanies);
    setNewBrandName('');
  };

  const updateBrandName = (companyId: string, brandId: string, newName: string) => {
    const updatedCompanies = companies.map(company =>
      company.id === companyId
        ? {
            ...company,
            brands: company.brands.map(brand =>
              brand.id === brandId ? { ...brand, name: newName } : brand
            )
          }
        : company
    );
    onCompaniesChange(updatedCompanies);
    setEditingBrand(null);
  };

  const deleteBrand = (companyId: string, brandId: string) => {
    const updatedCompanies = companies.map(company =>
      company.id === companyId
        ? { ...company, brands: company.brands.filter(brand => brand.id !== brandId) }
        : company
    );
    onCompaniesChange(updatedCompanies);
  };

  const addVariant = (companyId: string, brandId: string) => {
    if (!newVariant.trim()) return;

    const updatedCompanies = companies.map(company =>
      company.id === companyId
        ? {
            ...company,
            brands: company.brands.map(brand =>
              brand.id === brandId
                ? { ...brand, variants: [...brand.variants, newVariant.trim()] }
                : brand
            )
          }
        : company
    );
    
    onCompaniesChange(updatedCompanies);
    setNewVariant('');
    setActiveBrandForVariant(null);
  };

  const removeVariant = (companyId: string, brandId: string, variantIndex: number) => {
    const updatedCompanies = companies.map(company =>
      company.id === companyId
        ? {
            ...company,
            brands: company.brands.map(brand =>
              brand.id === brandId
                ? { ...brand, variants: brand.variants.filter((_, index) => index !== variantIndex) }
                : brand
            )
          }
        : company
    );
    onCompaniesChange(updatedCompanies);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Companies & Brands</Label>
        <p className="text-xs text-gray-500 mb-3">Manage customer's companies, brands, and variants</p>
      </div>

      {/* Add New Company */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter company name"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCompany();
            }
          }}
        />
        <Button onClick={(e) => {
          e.preventDefault();
          addCompany();
        }} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        {companies.map((company) => (
          <Card key={company.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                {editingCompany === company.id ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      defaultValue={company.name}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          updateCompanyName(company.id, (e.target as HTMLInputElement).value);
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector('input');
                        if (input) updateCompanyName(company.id, input.value);
                      }}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCompany(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>{company.name}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCompany(company.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteCompany(company.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Brand */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter brand name"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addBrand(company.id);
                    }
                  }}
                />
                <Button onClick={(e) => {
                  e.preventDefault();
                  addBrand(company.id);
                }} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Brands */}
              <div className="space-y-3">
                {company.brands.map((brand) => (
                  <div key={brand.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      {editingBrand === brand.id ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            defaultValue={brand.name}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                updateBrandName(company.id, brand.id, (e.target as HTMLInputElement).value);
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.parentElement?.querySelector('input');
                              if (input) updateBrandName(company.id, brand.id, input.value);
                            }}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBrand(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium">{brand.name}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingBrand(brand.id)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteBrand(company.id, brand.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Add Variant */}
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Enter variant"
                        value={activeBrandForVariant === brand.id ? newVariant : ''}
                        onChange={(e) => {
                          setActiveBrandForVariant(brand.id);
                          setNewVariant(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addVariant(company.id, brand.id);
                          }
                        }}
                      />
                      <Button onClick={(e) => {
                        e.preventDefault();
                        addVariant(company.id, brand.id);
                      }} size="sm" variant="outline">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Variants */}
                    <div className="flex flex-wrap gap-1">
                      {brand.variants.map((variant, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {variant}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 ml-1 hover:bg-red-100"
                            onClick={() => removeVariant(company.id, brand.id, index)}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyManagement;
