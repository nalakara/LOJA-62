import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import {
  Product,
  RawMaterial,
  Category,
  RawMaterialCategory,
  ProductWithDetails,
  RawMaterialWithDetails,
} from '../types';
import * as api from '../services/api';
import { calculateHpp, calculateStock } from '../lib/bomEngine';
import { useTranslation } from './LanguageContext';

interface InventoryContextValue {
  products: Product[];
  rawMaterials: RawMaterial[];
  categories: Category[];
  rawMaterialCategories: RawMaterialCategory[];
  productsWithDetails: ProductWithDetails[];
  rawMaterialsWithDetails: RawMaterialWithDetails[];
  isLoading: boolean;
  saveProduct: (productData: Omit<Product, 'id'>, id?: number) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  saveRawMaterial: (materialData: Omit<RawMaterial, 'id'>, id?: number) => Promise<void>;
  deleteRawMaterial: (materialId: number) => Promise<void>;
  saveCategory: (categoryData: Omit<Category, 'id'>, id?: number) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
  saveRawMaterialCategory: (categoryData: Omit<RawMaterialCategory, 'id'>, id?: number) => Promise<void>;
  deleteRawMaterialCategory: (categoryId: number) => Promise<void>;
  setRawMaterialsState: (materials: RawMaterial[]) => void;
  refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rawMaterialCategories, setRawMaterialCategories] = useState<RawMaterialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshInventory = useCallback(async () => {
    try {
      const [prodData, rawData, catData, rawCatData] = await Promise.all([
        api.getProducts(),
        api.getRawMaterials(),
        api.getCategories(),
        api.getRawMaterialCategories(),
      ]);
      setProducts(prodData);
      setRawMaterials(rawData);
      setCategories(catData);
      setRawMaterialCategories(rawCatData);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  // Derived state: products with recursive HPP and bottleneck stock
  const productsWithDetails: ProductWithDetails[] = useMemo(() => {
    const hppCache = new Map<number, number>();
    const stockCache = new Map<number, number>();

    return products.map(p => {
      const hpp = calculateHpp(p, products, rawMaterials, new Set(), hppCache);
      return {
        ...p,
        stock: calculateStock(p, products, rawMaterials, new Set(), stockCache),
        materialCost: hpp - (p.directLaborCost || 0) - (p.productionOverheadCost || 0),
        hpp: hpp,
        categoryName: categories.find(c => c.id === p.categoryId)?.name || 'N/A',
      };
    });
  }, [products, rawMaterials, categories]);

  // Derived state: raw materials with category labels
  const rawMaterialsWithDetails: RawMaterialWithDetails[] = useMemo(() => {
    return rawMaterials.map(m => ({
      ...m,
      categoryName: rawMaterialCategories.find(c => c.id === m.categoryId)?.name || 'N/A',
      supplierName: '-',
    }));
  }, [rawMaterials, rawMaterialCategories]);

  const saveProduct = useCallback(async (productData: Omit<Product, 'id'>, id?: number) => {
    await api.saveProduct(productData, id);
    setProducts(await api.getProducts());
  }, []);

  const deleteProduct = useCallback(async (productId: number) => {
    await api.deleteProduct(productId, t);
    setProducts(await api.getProducts());
  }, [t]);

  const saveRawMaterial = useCallback(async (materialData: Omit<RawMaterial, 'id'>, id?: number) => {
    await api.saveRawMaterial(materialData, id);
    setRawMaterials(await api.getRawMaterials());
  }, []);

  const deleteRawMaterial = useCallback(async (materialId: number) => {
    await api.deleteRawMaterial(materialId, t);
    setRawMaterials(await api.getRawMaterials());
  }, [t]);

  const saveCategory = useCallback(async (categoryData: Omit<Category, 'id'>, id?: number) => {
    await api.saveCategory(categoryData, id);
    setCategories(await api.getCategories());
  }, []);

  const deleteCategory = useCallback(async (categoryId: number) => {
    await api.deleteCategory(categoryId, t);
    setCategories(await api.getCategories());
  }, [t]);

  const saveRawMaterialCategory = useCallback(async (categoryData: Omit<RawMaterialCategory, 'id'>, id?: number) => {
    await api.saveRawMaterialCategory(categoryData, id);
    setRawMaterialCategories(await api.getRawMaterialCategories());
  }, []);

  const deleteRawMaterialCategory = useCallback(async (categoryId: number) => {
    await api.deleteRawMaterialCategory(categoryId, t);
    setRawMaterialCategories(await api.getRawMaterialCategories());
  }, [t]);

  const setRawMaterialsState = useCallback((materials: RawMaterial[]) => {
    setRawMaterials(materials);
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        products,
        rawMaterials,
        categories,
        rawMaterialCategories,
        productsWithDetails,
        rawMaterialsWithDetails,
        isLoading,
        saveProduct,
        deleteProduct,
        saveRawMaterial,
        deleteRawMaterial,
        saveCategory,
        deleteCategory,
        saveRawMaterialCategory,
        deleteRawMaterialCategory,
        setRawMaterialsState,
        refreshInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextValue => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
