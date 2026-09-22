import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProductionBatch } from '../types';
import * as api from '../services/api';
import { useInventory } from './InventoryContext';

interface ProductionContextValue {
  productionBatches: ProductionBatch[];
  isLoading: boolean;
  saveBatch: (batchData: Omit<ProductionBatch, 'id'>, id?: string) => Promise<{ isCompleted: boolean }>;
  deleteBatch: (batchId: string) => Promise<void>;
  refreshProductionBatches: () => Promise<void>;
}

const ProductionContext = createContext<ProductionContextValue | undefined>(undefined);

export const ProductionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setRawMaterialsState } = useInventory();
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProductionBatches = useCallback(async () => {
    try {
      const data = await api.getProductionBatches();
      setProductionBatches(data);
    } catch (err) {
      console.error('Failed to load production batches:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProductionBatches();
  }, [refreshProductionBatches]);

  const saveBatch = useCallback(async (batchData: Omit<ProductionBatch, 'id'>, id?: string) => {
    const { updatedRawMaterials } = await api.saveProductionBatch(batchData, id);
    if (updatedRawMaterials) {
      setRawMaterialsState(updatedRawMaterials);
    }
    setProductionBatches(await api.getProductionBatches());
    return { isCompleted: batchData.status === 'completed' };
  }, [setRawMaterialsState]);

  const deleteBatch = useCallback(async (batchId: string) => {
    const { updatedRawMaterials } = await api.deleteProductionBatch(batchId);
    if (updatedRawMaterials) {
      setRawMaterialsState(updatedRawMaterials);
    }
    setProductionBatches(await api.getProductionBatches());
  }, [setRawMaterialsState]);

  return (
    <ProductionContext.Provider
      value={{
        productionBatches,
        isLoading,
        saveBatch,
        deleteBatch,
        refreshProductionBatches,
      }}
    >
      {children}
    </ProductionContext.Provider>
  );
};

export const useProduction = (): ProductionContextValue => {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error('useProduction must be used within a ProductionProvider');
  }
  return context;
};
