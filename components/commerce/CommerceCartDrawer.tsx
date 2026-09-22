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
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/60 backdrop-blur-[2px] animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-bone-light border-l border-mineral h-full flex flex-col shadow-2xl animate-slide-left text-ink">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-mineral bg-bone">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-ink">{t('cart')}</h2>
            <span className="text-xs bg-mineral text-ink-muted font-bold px-2 py-0.5 rounded-md">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-ink-faint hover:text-ink p-1.5 rounded-lg hover:bg-mineral/40 transition-colors"
            aria-label={t('closeCart')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-ink-muted">
            <EmptyCartIcon className="w-16 h-16 text-mineral-dark mb-3" />
            <p className="font-semibold text-ink text-sm">{t('yourCartIsEmpty')}</p>
            <p className="text-xs text-ink-muted mt-1">{t('pleaseSelectProducts')}</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 space-y-3 divide-y divide-mineral/60">
            {cart.map((item, index) => {
              const isService = item.itemType === 'service';
              const maxStock = isService ? 99 : Math.max(1, item.stock);
              const itemTotal = item.sellPrice * item.quantity;

              return (
                <div key={`${item.id}-${index}`} className="pt-3 first:pt-0 flex gap-3 items-start">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-mineral-light shrink-0 border border-mineral"
                  />
                  <div className="flex-grow space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-ink line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-danger hover:text-danger-hover transition-colors p-1"
                        aria-label={t('delete')}
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-coffee">
                      {formatCurrency(item.sellPrice)}
                    </p>

                    {/* Selected Options Badge */}
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.selectedOptions).map(([k, v]) => (
                          <span
                            key={k}
                            className="text-[10px] bg-bone text-ink-muted px-1.5 py-0.5 rounded border border-mineral"
                          >
                            {k}: <strong className="text-ink">{v}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-[10px] text-ink-muted italic line-clamp-1">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-1.5 bg-bone rounded-lg p-0.5 border border-mineral">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-ink hover:text-coffee rounded disabled:opacity-30"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="min-w-6 px-1 text-center text-xs font-bold text-ink">
                          {item.quantity} {isService ? 'kg' : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, 1)}
                          disabled={item.quantity >= maxStock}
                          className="p-1 text-ink hover:text-coffee rounded disabled:opacity-30"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-ink">
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
          <div className="p-4 bg-bone border-t border-mineral space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>{t('subtotal')}</span>
                <span className="text-ink font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-ink-muted">
                  <span>{t('tax')} ({taxRate}%)</span>
                  <span className="text-ink font-semibold">{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-mineral">
                <span>{t('total')}</span>
                <span className="text-coffee">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={onProceedCheckout}
              className="w-full py-2.5 bg-coffee hover:bg-coffee-hover text-bone font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
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
