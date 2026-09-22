import React, { useState } from 'react';
import { ProductWithDetails, CartItem } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { CloseIcon, MinusIcon, PlusIcon } from '../icons';

interface CommerceItemModalProps {
  item: ProductWithDetails;
  formatCurrency: (amount: number) => string;
  onClose: () => void;
  onAddToCart: (configuredItem: CartItem) => void;
}

export const CommerceItemModal: React.FC<CommerceItemModalProps> = ({
  item,
  formatCurrency,
  onClose,
  onAddToCart,
}) => {
  const { t } = useTranslation();
  const isService = item.itemType === 'service';
  const maxQuantity = isService ? 99 : Math.max(1, item.stock);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (item.options && item.options.length > 0) {
      item.options.forEach(opt => {
        if (opt.choices && opt.choices.length > 0) {
          initial[opt.name] = opt.choices[0];
        }
      });
    }
    return initial;
  });
  const [notes, setNotes] = useState<string>('');

  const handleOptionChange = (optionName: string, choice: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: choice }));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxQuantity) return maxQuantity;
      return next;
    });
  };

  const handleAdd = () => {
    const cartItem: CartItem = {
      ...item,
      quantity,
      selectedOptions: Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined,
      notes: notes.trim() ? notes.trim() : undefined,
    };
    onAddToCart(cartItem);
    onClose();
  };

  const itemTotal = item.sellPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-bone-light border border-mineral rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-mineral bg-bone">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                isService ? 'bg-oxide-subtle text-oxide' : 'bg-mineral text-ink-muted'
              }`}
            >
              {isService ? t('serviceBadge') : t('productBadge')}
            </span>
            <h2 className="text-base font-bold text-ink line-clamp-1">{item.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-faint hover:text-ink p-1 rounded-lg hover:bg-mineral/40 transition-colors"
            aria-label={t('closeCart')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 space-y-4 flex-grow text-ink">
          {/* Image & Description */}
          <div className="flex gap-3.5 items-start">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-xl bg-mineral-light shrink-0 border border-mineral"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-ink">{item.name}</p>
              <p className="text-sm font-bold text-coffee">{formatCurrency(item.sellPrice)}</p>
              {item.description && (
                <p className="text-xs text-ink-muted leading-relaxed">{item.description}</p>
              )}
            </div>
          </div>

          {/* Options (Configuration metadata) */}
          {item.options && item.options.length > 0 && (
            <div className="space-y-3.5 pt-2 border-t border-mineral/70">
              {item.options.map(opt => (
                <div key={opt.name} className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink block">{opt.name}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {opt.choices.map(choice => {
                      const isSelected = selectedOptions[opt.name] === choice;
                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => handleOptionChange(opt.name, choice)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg text-left border transition-all ${
                            isSelected
                              ? 'bg-coffee text-bone border-coffee shadow-sm'
                              : 'bg-bone border-mineral text-ink-muted hover:border-mineral-dark hover:text-ink'
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Notes / Custom Request */}
          <div className="space-y-1.5 pt-2 border-t border-mineral/70">
            <label className="text-xs font-semibold text-ink block">
              {isService ? t('customRequest') : t('itemNotes')}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('itemNotesPlaceholder')}
              rows={2}
              className="w-full text-xs bg-bone border border-mineral rounded-lg p-2.5 text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors resize-none"
            />
          </div>

          {/* Quantity / Amount Selector */}
          <div className="pt-2 border-t border-mineral/70 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-ink block">
                {isService ? t('amountInKg') : t('quantity')}
              </span>
              {!isService && (
                <span className="text-[11px] text-ink-muted">
                  {t('available')}: {item.stock}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 bg-bone border border-mineral rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-1.5 text-ink hover:text-coffee rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-mineral-light transition-colors"
              >
                <MinusIcon className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-ink">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
                className="p-1.5 text-ink hover:text-coffee rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-mineral-light transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-bone border-t border-mineral flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-ink-muted block">{t('total')}</span>
            <span className="text-base font-bold text-coffee">{formatCurrency(itemTotal)}</span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="px-5 py-2.5 bg-coffee hover:bg-coffee-hover text-bone text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};
