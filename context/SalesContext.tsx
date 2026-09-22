import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { SaleTransaction, CartItem } from '../types';
import * as api from '../services/api';
import { useInventory } from './InventoryContext';
import { useSettings } from './SettingsContext';

interface SalesContextValue {
  salesHistory: SaleTransaction[];
  invoiceCounter: number;
  salesToday: SaleTransaction[];
  isLoading: boolean;
  processCheckout: (
    cart: CartItem[],
    paymentStatus?: 'paid' | 'unpaid',
    customerId?: number,
    channel?: 'pos' | 'commerce',
    paymentMethod?: string
  ) => Promise<{ updatedRawMaterials: any[]; newTransaction: SaleTransaction }>;
  refreshSales: () => Promise<void>;
}

const SalesContext = createContext<SalesContextValue | undefined>(undefined);

export const SalesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { products, setRawMaterialsState } = useInventory();
  const { settings } = useSettings();
  const [salesHistory, setSalesHistory] = useState<SaleTransaction[]>([]);
  const [invoiceCounter, setInvoiceCounter] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSales = useCallback(async () => {
    try {
      const [historyData, counterData] = await Promise.all([
        api.getSalesHistory(),
        api.getInvoiceCounter(),
      ]);
      setSalesHistory(historyData);
      setInvoiceCounter(counterData);
    } catch (err) {
      console.error('Failed to load sales data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSales();
  }, [refreshSales]);

  const salesToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return salesHistory.filter(sale => new Date(sale.timestamp) >= today);
  }, [salesHistory]);

  const processCheckout = useCallback(
    async (
      cart: CartItem[],
      paymentStatus: 'paid' | 'unpaid' = 'paid',
      customerId?: number,
      channel: 'pos' | 'commerce' = 'pos',
      paymentMethod?: string
    ) => {
      const { updatedRawMaterials, newTransaction } = await api.processSale(
        cart,
        products,
        settings,
        invoiceCounter,
        paymentStatus,
        customerId,
        channel,
        paymentMethod
      );

      setRawMaterialsState(updatedRawMaterials);
      setSalesHistory(prev => [newTransaction, ...prev]);
      setInvoiceCounter(prev => prev + 1);

      return { updatedRawMaterials, newTransaction };
    },
    [products, settings, invoiceCounter, setRawMaterialsState]
  );

  return (
    <SalesContext.Provider
      value={{
        salesHistory,
        invoiceCounter,
        salesToday,
        isLoading,
        processCheckout,
        refreshSales,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = (): SalesContextValue => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
