import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PurchaseOrder } from '../types';
import * as api from '../services/api';
import { useInventory } from './InventoryContext';

interface ProcurementContextValue {
  purchaseOrders: PurchaseOrder[];
  isLoading: boolean;
  savePurchaseOrder: (poData: Omit<PurchaseOrder, 'id' | 'totalCost'>, id?: string) => Promise<void>;
  receiveItems: (poId: string, itemsToReceive: { rawMaterialId: number; quantity: number }[]) => Promise<void>;
  refreshPurchaseOrders: () => Promise<void>;
}

const ProcurementContext = createContext<ProcurementContextValue | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { rawMaterials, refreshInventory } = useInventory();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPurchaseOrders = useCallback(async () => {
    try {
      const data = await api.getPurchaseOrders();
      setPurchaseOrders(data);
    } catch (err) {
      console.error('Failed to load purchase orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPurchaseOrders();
  }, [refreshPurchaseOrders]);

  const savePurchaseOrder = useCallback(async (poData: Omit<PurchaseOrder, 'id' | 'totalCost'>, id?: string) => {
    await api.savePurchaseOrder(poData, rawMaterials, id);
    setPurchaseOrders(await api.getPurchaseOrders());
  }, [rawMaterials]);

  const receiveItems = useCallback(async (poId: string, itemsToReceive: { rawMaterialId: number; quantity: number }[]) => {
    await api.receivePurchaseOrderItems(poId, itemsToReceive);
    setPurchaseOrders(await api.getPurchaseOrders());
    await refreshInventory();
  }, [refreshInventory]);

  return (
    <ProcurementContext.Provider
      value={{
        purchaseOrders,
        isLoading,
        savePurchaseOrder,
        receiveItems,
        refreshPurchaseOrders,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = (): ProcurementContextValue => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
