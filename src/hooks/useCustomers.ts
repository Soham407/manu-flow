import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Customer } from '@/types';
import { hashPassword } from '@/utils/password';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      console.log('Starting to fetch customers...');
      setLoading(true);
      
      // First, fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select(`
          id,
          name,
          email,
          phone,
          address,
          balance,
          advance_deposit,
          created_at,
          is_hidden
        `)
        .order('created_at', { ascending: false });

      if (customersError) {
        console.error('Error fetching customers:', {
          message: customersError.message,
          details: customersError.details,
          hint: customersError.hint,
          code: customersError.code
        });
        throw customersError;
      }

      if (!customersData) {
        console.log('No customer data returned from Supabase');
        setCustomers([]);
        return;
      }

      console.log('Raw customer data:', customersData);

      // Then, fetch companies and brands for each customer
      const customersWithCompanies = await Promise.all(
        customersData.map(async (customer) => {
          // Fetch companies
          const { data: companiesData, error: companiesError } = await supabase
            .from('companies')
            .select('id, name')
            .eq('customer_id', customer.id);

          if (companiesError) {
            console.error(`Error fetching companies for customer ${customer.id}:`, companiesError);
            return {
              ...customer,
              companies: []
            };
          }

          // For each company, fetch its brands
          const companiesWithBrands = await Promise.all(
            (companiesData || []).map(async (company) => {
              const { data: brandsData, error: brandsError } = await supabase
                .from('brands')
                .select('id, name, variants')
                .eq('company_id', company.id);

              if (brandsError) {
                console.error(`Error fetching brands for company ${company.id}:`, brandsError);
                return {
                  ...company,
                  brands: []
                };
              }

              return {
                ...company,
                brands: brandsData || []
              };
            })
          );

          return {
            ...customer,
            companies: companiesWithBrands
          };
        })
      );

      const formattedCustomers: Customer[] = customersWithCompanies.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        balance: Number(customer.balance),
        advanceDeposit: Number(customer.advance_deposit),
        createdAt: customer.created_at,
        is_hidden: customer.is_hidden || false,
        companies: customer.companies.map(company => ({
          id: company.id,
          name: company.name,
          brands: company.brands.map(brand => ({
            id: brand.id,
            name: brand.name,
            variants: brand.variants || []
          }))
        }))
      }));

      console.log('Formatted customers:', formattedCustomers);
      setCustomers(formattedCustomers);
    } catch (err) {
      console.error('Error in fetchCustomers:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useCustomers hook mounted');
    fetchCustomers();
  }, []);

  const addCustomer = async (customerData: Partial<Customer>) => {
    try {
      console.log('Starting customer creation with data:', customerData);
      
      // First, check if a user with this email already exists
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('email', customerData.email)
        .single();

      if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking existing user:', userCheckError);
        throw userCheckError;
      }

      if (existingUser) {
        throw new Error(`A user with email "${customerData.email}" already exists. Please use a different email address.`);
      }

      // Create user account first
      const passwordHash = await hashPassword('password123');
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: customerData.email,
          name: customerData.name,
          role: 'customer',
          password_hash: passwordHash,
          needs_password_change: true,
          is_active: true
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user account:', userError);
        throw userError;
      }

      // Then insert the customer
      const { data: customerResult, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          balance: customerData.balance || 0,
          advance_deposit: customerData.advanceDeposit || 0,
          is_hidden: false
        })
        .select()
        .single();

      if (customerError) {
        console.error('Customer insertion error:', customerError);
        // If customer creation fails, delete the user account we just created
        await supabase
          .from('users')
          .delete()
          .eq('id', newUser.id);
        throw customerError;
      }

      console.log('Customer created successfully:', customerResult);
      await fetchCustomers(); // Refresh the list
      return customerResult;
    } catch (err) {
      console.error('Error adding customer:', err);
      throw err;
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      console.log('Starting customer update with data:', customerData);
      
      // First, update the customer basic information
      const { error: customerError } = await supabase
        .from('customers')
        .update({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          balance: customerData.balance,
          advance_deposit: customerData.advanceDeposit,
          is_hidden: customerData.is_hidden
        })
        .eq('id', id);

      if (customerError) {
        console.error('Customer update error:', customerError);
        if (customerError.code === '23505' && customerError.message.includes('email')) {
          throw new Error(`A customer with email "${customerData.email}" already exists. Please use a different email address.`);
        }
        throw customerError;
      }

      console.log('Customer basic info updated successfully');

      // Handle companies and brands if provided
      if (customerData.companies) {
        console.log('Processing companies update:', customerData.companies);
        
        // Delete existing companies and brands for this customer
        // This will cascade delete brands due to foreign key relationship
        const { error: deleteError } = await supabase
          .from('companies')
          .delete()
          .eq('customer_id', id);

        if (deleteError) {
          console.error('Error deleting existing companies:', deleteError);
          throw new Error(`Failed to update companies: ${deleteError.message}`);
        }

        console.log('Existing companies and brands deleted successfully');

        // Insert new companies and brands
        for (const company of customerData.companies) {
          console.log('Inserting company:', company.name);
          
          // Insert company without the id field (let Supabase generate it)
          const { data: companyResult, error: companyError } = await supabase
            .from('companies')
            .insert({
              customer_id: id,
              name: company.name
            })
            .select()
            .single();

          if (companyError) {
            console.error('Company insertion error:', companyError);
            throw new Error(`Failed to create company "${company.name}": ${companyError.message}`);
          }

          console.log('Company created successfully:', companyResult);

          // If brands are provided for this company, insert them
          if (company.brands && company.brands.length > 0) {
            console.log('Processing brands for company:', company.name);
            
            for (const brand of company.brands) {
              console.log('Inserting brand:', brand.name);
              
              // Insert brand without the id field (let Supabase generate it)
              const { error: brandError } = await supabase
                .from('brands')
                .insert({
                  company_id: companyResult.id,
                  name: brand.name,
                  variants: brand.variants || []
                });

              if (brandError) {
                console.error('Brand insertion error:', brandError);
                throw new Error(`Failed to create brand "${brand.name}": ${brandError.message}`);
              }

              console.log('Brand created successfully:', brand.name);
            }
          }
        }
      }
      
      console.log('Customer update completed successfully');
      await fetchCustomers(); // Refresh the list
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      console.log('Starting customer deletion:', id);
      
      // Delete the customer (this will cascade delete companies and brands)
      const { error: deleteError } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting customer:', deleteError);
        throw new Error(`Failed to delete customer: ${deleteError.message}`);
      }

      console.log('Customer deleted successfully');
      await fetchCustomers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  };

  const toggleCustomerVisibility = async (id: string) => {
    try {
      console.log('Starting customer visibility toggle:', id);
      
      // Get current customer
      const { data: customer, error: fetchError } = await supabase
        .from('customers')
        .select('is_hidden')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching customer:', fetchError);
        throw new Error(`Failed to fetch customer: ${fetchError.message}`);
      }

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Toggle visibility
      const { error: updateError } = await supabase
        .from('customers')
        .update({ is_hidden: !customer.is_hidden })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating customer visibility:', updateError);
        throw new Error(`Failed to update customer visibility: ${updateError.message}`);
      }

      console.log('Customer visibility toggled successfully');
      await fetchCustomers(); // Refresh the list
    } catch (err) {
      console.error('Error toggling customer visibility:', err);
      throw err;
    }
  };

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerVisibility
  };
};
