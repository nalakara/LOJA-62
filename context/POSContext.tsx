import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { CartItem, ProductWithDetails } from '../types';
import { useInventory } from './InventoryContext';
import { useSettings } from './SettingsContext';
import { useSales } from './SalesContext';
import { useToast } from './ToastContext';
import { useTranslation } from './LanguageContext';

interface POSContextValue {
  cart: CartItem[];
  selectedCategory: number | 'All';
  filteredProducts: ProductWithDetails[];
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  addToCart: (product: ProductWithDetails) => void;
  updateQuantity: (productId: number, amount: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  setSelectedCategory: (category: number | 'All') => void;
  checkout: (paymentStatus?: 'paid' | 'unpaid', customerId?: number) => Promise<string | null>;
}

const POSContext = createContext<POSContextValue | undefined>(undefined);

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { productsWithDetails } = useInventory();
  const { settings } = useSettings();
  const { processCheckout } = useSales();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All');

  const filteredProducts = useMemo(() => {
    const finalProducts = productsWithDetails.filter(p => p.sellPrice > 0);
    if (selectedCategory === 'All') {
      return finalProducts;
    }
    return finalProducts.filter(p => p.categoryId === selectedCategory);
  }, [productsWithDetails, selectedCategory]);

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.sellPrice * item.quantity, 0),
    [cart]
  );
  const cartTax = useMemo(
    () => cartSubtotal * (settings.taxRate / 100),
    [cartSubtotal, settings.taxRate]
  );
  const cartTotal = useMemo(() => cartSubtotal + cartTax, [cartSubtotal, cartTax]);

  const addToCart = useCallback((product: ProductWithDetails) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return prevCart;
      } else {
        if (product.stock > 0) {
          return [...prevCart, { ...product, quantity: 1 }];
        }
        return prevCart;
      }
    });
  }, []);

  const updateQuantity = useCallback((productId: number, amount: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity + amount;
            if (newQuantity > 0 && newQuantity <= item.stock) {
              return { ...item, quantity: newQuantity };
            }
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const checkout = useCallback(
    async (paymentStatus: 'paid' | 'unpaid' = 'paid', customerId?: number): Promise<string | null> => {
      if (cart.length === 0) {
        toast.error(t('cartIsEmpty'));
        return null;
      }
      try {
        const { newTransaction } = await processCheckout(cart, paymentStatus, customerId);
        setCart([]);
        return newTransaction.id;
      } catch (err: any) {
        toast.error(err.message);
        return null;
      }
    },
    [cart, processCheckout, toast, t]
  );

  return (
    <POSContext.Provider
      value={{
        cart,
        selectedCategory,
        filteredProducts,
        cartSubtotal,
        cartTax,
        cartTotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        setSelectedCategory,
        checkout,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = (): POSContextValue => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
