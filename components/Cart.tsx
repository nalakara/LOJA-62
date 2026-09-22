import React from 'react';
import { CartItem } from '../types';
import { MinusIcon, PlusIcon, TrashIcon, EmptyCartIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, amount: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
  onCreateInvoice: () => void;
  formatCurrency: (amount: number) => string;
  taxRate: number;
}

const Cart: React.FC<CartProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, onCreateInvoice, formatCurrency, taxRate }) => {
  const { t } = useTranslation();
  const subtotal = cartItems.reduce((acc, item) => acc + item.sellPrice * item.quantity, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="bg-bone-light border border-mineral rounded-xl shadow-sm p-5 flex flex-col h-full sticky top-28">
      <h2 className="text-lg font-bold text-ink border-b border-mineral pb-3 mb-4">{t('cart')}</h2>
      
      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-ink-muted py-8">
          <EmptyCartIcon className="h-16 w-16 text-mineral-dark mb-3" />
          <p className="font-semibold text-sm text-ink">{t('yourCartIsEmpty')}</p>
          <p className="text-xs text-ink-muted mt-0.5">{t('pleaseSelectProducts')}</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto space-y-3 pr-1 max-h-[48vh]">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg bg-bone/70 border border-mineral/60">
              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-mineral-light shrink-0" />
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-xs text-ink line-clamp-1">{item.name}</p>
                <p className="text-xs font-bold text-coffee mt-0.5">{formatCurrency(item.sellPrice)}</p>
                <div className="flex items-center space-x-1.5 mt-1">
                  <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 rounded bg-mineral hover:bg-mineral-dark transition text-ink"><MinusIcon className="h-3 w-3" /></button>
                  <span className="px-2 text-xs font-bold text-ink">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 rounded bg-mineral hover:bg-mineral-dark transition text-ink"><PlusIcon className="h-3 w-3" /></button>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <p className="font-bold text-xs text-ink">{formatCurrency(item.sellPrice * item.quantity)}</p>
                <button onClick={() => onRemoveItem(item.id)} className="text-danger hover:text-danger-hover mt-1 p-1 transition" aria-label={t('delete')}><TrashIcon className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-mineral pt-4 mt-auto space-y-3">
        <div className="space-y-1.5 text-xs text-ink-muted">
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <span className="font-semibold text-ink">{formatCurrency(subtotal)}</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between">
              <span>{t('tax')} ({taxRate}%)</span>
              <span className="font-semibold text-ink">{formatCurrency(tax)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-ink pt-2 border-t border-mineral">
            <span>{t('total')}</span>
            <span className="text-coffee">{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
            <button
                onClick={onCreateInvoice}
                disabled={cartItems.length === 0}
                className="flex-1 bg-mineral-light border border-mineral text-ink font-semibold py-2.5 rounded-lg hover:bg-mineral transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t('createInvoice')}
            </button>
            <button
                onClick={onCheckout}
                disabled={cartItems.length === 0}
                className="flex-1 bg-coffee text-bone font-semibold py-2.5 rounded-lg hover:bg-coffee-hover shadow-sm transition text-xs disabled:bg-mineral-dark disabled:text-ink-faint disabled:cursor-not-allowed"
            >
                {t('checkout')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;