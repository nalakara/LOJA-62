import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { StoreAsset } from '../types';
import * as api from '../services/api';

interface StoreAssetsContextValue {
  storeAssets: StoreAsset[];
  isLoading: boolean;
  saveAsset: (assetData: Omit<StoreAsset, 'id'>, id?: number) => Promise<void>;
  deleteAsset: (assetId: number) => Promise<void>;
  refreshStoreAssets: () => Promise<void>;
}

const StoreAssetsContext = createContext<StoreAssetsContextValue | undefined>(undefined);

export const StoreAssetsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storeAssets, setStoreAssets] = useState<StoreAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStoreAssets = useCallback(async () => {
    try {
      const data = await api.getStoreAssets();
      setStoreAssets(data);
    } catch (err) {
      console.error('Failed to load store assets:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStoreAssets();
  }, [refreshStoreAssets]);

  const saveAsset = useCallback(async (assetData: Omit<StoreAsset, 'id'>, id?: number) => {
    await api.saveStoreAsset(assetData, id);
    setStoreAssets(await api.getStoreAssets());
  }, []);

  const deleteAsset = useCallback(async (assetId: number) => {
    await api.deleteStoreAsset(assetId);
    setStoreAssets(await api.getStoreAssets());
  }, []);

  return (
    <StoreAssetsContext.Provider
      value={{
        storeAssets,
        isLoading,
        saveAsset,
        deleteAsset,
        refreshStoreAssets,
      }}
    >
      {children}
    </StoreAssetsContext.Provider>
  );
};

export const useStoreAssets = (): StoreAssetsContextValue => {
  const context = useContext(StoreAssetsContext);
  if (!context) {
    throw new Error('useStoreAssets must be used within a StoreAssetsProvider');
  }
  return context;
};
