import React from 'react';
import { CartItem } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, EmptyCartIcon } from '../icons';

interface CommerceCartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  formatCurrency: (amount: number) => string;
  onClose: () => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedCheckout: () => void;
}

export const CommerceCartDrawer: React.FC<CommerceCartDrawerProps> = ({
  isOpen,
  cart,
  subtotal,
  tax,
  total,
  taxRate,
  formatCurrency,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">{t('cart')}</h2>
            <span className="text-xs bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label={t('closeCart')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <EmptyCartIcon className="w-16 h-16 text-slate-600 mb-3" />
            <p className="font-semibold text-slate-300 text-sm">{t('yourCartIsEmpty')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('pleaseSelectProducts')}</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/60">
            {cart.map((item, index) => {
              const isService = item.itemType === 'service';
              const maxStock = isService ? 99 : Math.max(1, item.stock);
              const itemTotal = item.sellPrice * item.quantity;

              return (
                <div key={`${item.id}-${index}`} className="pt-3 first:pt-0 flex gap-3 items-start">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-slate-800 shrink-0 border border-slate-700/60"
                  />
                  <div className="flex-grow space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-slate-100 line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        aria-label={t('delete')}
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-purple-400">
                      {formatCurrency(item.sellPrice)}
                    </p>

                    {/* Selected Options Badge */}
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.selectedOptions).map(([k, v]) => (
                          <span
                            key={k}
                            className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/50"
                          >
                            {k}: <strong className="text-slate-200">{v}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-[10px] text-slate-400 italic line-clamp-1">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2 bg-slate-800 rounded-md p-0.5 border border-slate-700">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-slate-300 hover:text-white rounded disabled:opacity-30"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="min-w-6 px-1 text-center text-xs font-bold text-slate-100">
                          {item.quantity} {isService ? 'kg' : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, 1)}
                          disabled={item.quantity >= maxStock}
                          className="p-1 text-slate-300 hover:text-white rounded disabled:opacity-30"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-slate-200">
                        {formatCurrency(itemTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Drawer Footer (Subtotal, Tax, Total, Checkout) */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{t('subtotal')}</span>
                <span className="text-slate-200 font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>{t('tax')} ({taxRate}%)</span>
                  <span className="text-slate-200 font-medium">{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-100 pt-2 border-t border-slate-800">
                <span>{t('total')}</span>
                <span className="text-purple-400">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={onProceedCheckout}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>{t('checkout')}</span>
              <span>&bull;</span>
              <span>{formatCurrency(total)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
