import React, { useState, useMemo } from 'react';
import { ProductWithDetails, CartItem } from '../../types';
import { useInventory } from '../../context/InventoryContext';
import { useSettings } from '../../context/SettingsContext';
import { useSales } from '../../context/SalesContext';
import { useContacts } from '../../context/ContactsContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../context/LanguageContext';
import { ShoppingBagIcon, SearchIcon } from '../icons';
import { CommerceItemCard } from './CommerceItemCard';
import { CommerceItemModal } from './CommerceItemModal';
import { CommerceCartDrawer } from './CommerceCartDrawer';
import { CommerceCheckoutModal } from './CommerceCheckoutModal';

export const CommerceView: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { productsWithDetails, categories } = useInventory();
  const { settings, formatCurrency } = useSettings();
  const { processCheckout } = useSales();
  const { customers } = useContacts();

  // Storefront Filter States
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'product' | 'service'>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Commerce Local Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active Item Configuration Modal
  const [selectedItem, setSelectedItem] = useState<ProductWithDetails | null>(null);

  // Active Checkout Modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filter Catalog (Products + Services)
  const filteredItems = useMemo(() => {
    return productsWithDetails.filter(item => {
      // Must be eligible for sale
      if (item.sellPrice <= 0) return false;

      // Type Filter (all / product / service)
      const itemType = item.itemType || 'product';
      if (activeTypeFilter !== 'all' && itemType !== activeTypeFilter) {
        return false;
      }

      // Category Filter
      if (selectedCategoryId !== 'all' && item.categoryId !== selectedCategoryId) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q) || false;
        const matchesCat = item.categoryName?.toLowerCase().includes(q) || false;
        return matchesName || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [productsWithDetails, activeTypeFilter, selectedCategoryId, searchQuery]);

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.sellPrice * item.quantity, 0);
  }, [cart]);

  const cartTax = useMemo(() => {
    return cartSubtotal * (settings.taxRate / 100);
  }, [cartSubtotal, settings.taxRate]);

  const cartTotal = useMemo(() => cartSubtotal + cartTax, [cartSubtotal, cartTax]);
  const cartItemCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  // Cart Handlers
  const handleAddToCart = (newItem: CartItem) => {
    setCart(prev => {
      // Find matching item by id and exact options
      const existingIndex = prev.findIndex(item => {
        if (item.id !== newItem.id) return false;
        const optA = JSON.stringify(item.selectedOptions || {});
        const optB = JSON.stringify(newItem.selectedOptions || {});
        return optA === optB;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const maxStock = newItem.itemType === 'service' ? 99 : newItem.stock;
        const newQty = Math.min(maxStock, existing.quantity + newItem.quantity);
        updated[existingIndex] = { ...existing, quantity: newQty, notes: newItem.notes || existing.notes };
        return updated;
      }

      return [...prev, newItem];
    });

    toast.success(t('addedToCart'));
  };

  const handleUpdateCartQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const target = updated[index];
      if (!target) return prev;
      const maxStock = target.itemType === 'service' ? 99 : Math.max(1, target.stock);
      const newQty = target.quantity + delta;
      if (newQty < 1) return prev;
      if (newQty > maxStock) return prev;
      updated[index] = { ...target, quantity: newQty };
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Checkout Handlers
  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      toast.error(t('cartIsEmpty'));
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = async ({
    customerName,
    customerContact,
    customerId,
    paymentMethod,
  }: {
    customerName: string;
    customerContact: string;
    customerId?: number;
    paymentMethod: string;
  }) => {
    // Process sale through shared SalesContext using 'commerce' channel metadata
    const { newTransaction } = await processCheckout(
      cart,
      'paid',
      customerId,
      'commerce',
      paymentMethod
    );

    setCart([]);
    setIsCheckoutOpen(false);

    const message = t('orderPlacedSuccess').replace('{invoiceId}', newTransaction.id);
    toast.success(message, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Storefront Top Header Bar */}
      <div className="bg-bone-light border border-mineral rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShoppingBagIcon className="w-7 h-7 text-coffee" />
            <h2 className="text-2xl font-bold text-ink tracking-tight">
              {settings.storeName || 'Loja-62'} Storefront
            </h2>
          </div>
          <p className="text-xs text-ink-muted mt-1 max-w-xl">
            {t('storefrontSubtitle')}
          </p>
        </div>

        {/* Cart Quick Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="self-start md:self-auto flex items-center gap-2.5 bg-coffee hover:bg-coffee-hover text-bone px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all group"
        >
          <ShoppingBagIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>{t('viewCart')}</span>
          {cartItemCount > 0 && (
            <span className="bg-bone/20 text-bone px-2 py-0.5 rounded-full text-[11px] font-bold">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Type Switcher (All / Physical Products / Services) */}
        <div className="flex bg-bone-light border border-mineral p-1 rounded-xl shrink-0">
          {[
            { key: 'all', label: t('filterAll') },
            { key: 'product', label: t('filterProducts') },
            { key: 'service', label: t('filterServices') },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTypeFilter(tab.key as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTypeFilter === tab.key
                  ? 'bg-coffee text-bone shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full text-xs bg-bone-light border border-mineral rounded-xl pl-9 pr-3.5 py-2 text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
              selectedCategoryId === 'all'
                ? 'bg-coffee text-bone font-semibold shadow-sm'
                : 'bg-bone-light border border-mineral text-ink-muted hover:bg-mineral-light'
            }`}
          >
            {t('all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                selectedCategoryId === cat.id
                  ? 'bg-coffee text-bone font-semibold shadow-sm'
                  : 'bg-bone-light border border-mineral text-ink-muted hover:bg-mineral-light'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Catalog Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-bone-light border border-mineral rounded-2xl p-12 text-center text-ink-muted space-y-2">
          <p className="text-sm font-semibold">{t('noItemsFound')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map(item => (
            <CommerceItemCard
              key={item.id}
              item={item}
              formatCurrency={formatCurrency}
              onSelect={setSelectedItem}
            />
          ))}
        </div>
      )}

      {/* Item Configuration Modal */}
      {selectedItem && (
        <CommerceItemModal
          item={selectedItem}
          formatCurrency={formatCurrency}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Customer Cart Drawer */}
      <CommerceCartDrawer
        isOpen={isCartOpen}
        cart={cart}
        subtotal={cartSubtotal}
        tax={cartTax}
        total={cartTotal}
        taxRate={settings.taxRate}
        formatCurrency={formatCurrency}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={handleOpenCheckout}
      />

      {/* Customer Checkout Modal */}
      <CommerceCheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        subtotal={cartSubtotal}
        tax={cartTax}
        total={cartTotal}
        taxRate={settings.taxRate}
        customers={customers}
        formatCurrency={formatCurrency}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
};
