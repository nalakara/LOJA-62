import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { StockAdjustment } from '../types';
import * as api from '../services/api';
import { useInventory } from './InventoryContext';
import { useTranslation } from './LanguageContext';

interface StockAdjustmentsContextValue {
  stockAdjustments: StockAdjustment[];
  isLoading: boolean;
  saveAdjustment: (adjustmentData: Omit<StockAdjustment, 'id' | 'date'>) => Promise<void>;
  refreshStockAdjustments: () => Promise<void>;
}

const StockAdjustmentsContext = createContext<StockAdjustmentsContextValue | undefined>(undefined);

export const StockAdjustmentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { refreshInventory } = useInventory();
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStockAdjustments = useCallback(async () => {
    try {
      const data = await api.getStockAdjustments();
      setStockAdjustments(data);
    } catch (err) {
      console.error('Failed to load stock adjustments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStockAdjustments();
  }, [refreshStockAdjustments]);

  const saveAdjustment = useCallback(async (adjustmentData: Omit<StockAdjustment, 'id' | 'date'>) => {
    await api.saveStockAdjustment(adjustmentData, t);
    await refreshInventory();
    setStockAdjustments(await api.getStockAdjustments());
  }, [t, refreshInventory]);

  return (
    <StockAdjustmentsContext.Provider
      value={{
        stockAdjustments,
        isLoading,
        saveAdjustment,
        refreshStockAdjustments,
      }}
    >
      {children}
    </StockAdjustmentsContext.Provider>
  );
};

export const useStockAdjustments = (): StockAdjustmentsContextValue => {
  const context = useContext(StockAdjustmentsContext);
  if (!context) {
    throw new Error('useStockAdjustments must be used within a StockAdjustmentsProvider');
  }
  return context;
};
