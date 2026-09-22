import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Supplier, Customer } from '../types';
import * as api from '../services/api';
import { useTranslation } from './LanguageContext';

interface ContactsContextValue {
  suppliers: Supplier[];
  customers: Customer[];
  isLoading: boolean;
  saveSupplier: (supplierData: Omit<Supplier, 'id'>, id?: number) => Promise<void>;
  deleteSupplier: (supplierId: number) => Promise<void>;
  saveCustomer: (customerData: Omit<Customer, 'id'>, id?: number) => Promise<void>;
  deleteCustomer: (customerId: number) => Promise<void>;
  refreshContacts: () => Promise<void>;
}

const ContactsContext = createContext<ContactsContextValue | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshContacts = useCallback(async () => {
    try {
      const [supData, custData] = await Promise.all([
        api.getSuppliers(),
        api.getCustomers(),
      ]);
      setSuppliers(supData);
      setCustomers(custData);
    } catch (err) {
      console.error('Failed to load contacts data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContacts();
  }, [refreshContacts]);

  const saveSupplier = useCallback(async (supplierData: Omit<Supplier, 'id'>, id?: number) => {
    await api.saveSupplier(supplierData, id);
    setSuppliers(await api.getSuppliers());
  }, []);

  const deleteSupplier = useCallback(async (supplierId: number) => {
    await api.deleteSupplier(supplierId, t);
    setSuppliers(await api.getSuppliers());
  }, [t]);

  const saveCustomer = useCallback(async (customerData: Omit<Customer, 'id'>, id?: number) => {
    await api.saveCustomer(customerData, id);
    setCustomers(await api.getCustomers());
  }, []);

  const deleteCustomer = useCallback(async (customerId: number) => {
    await api.deleteCustomer(customerId);
    setCustomers(await api.getCustomers());
  }, []);

  return (
    <ContactsContext.Provider
      value={{
        suppliers,
        customers,
        isLoading,
        saveSupplier,
        deleteSupplier,
        saveCustomer,
        deleteCustomer,
        refreshContacts,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = (): ContactsContextValue => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};
