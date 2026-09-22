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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isService ? 'bg-sky-500/20 text-sky-300' : 'bg-purple-500/20 text-purple-300'
              }`}
            >
              {isService ? t('serviceBadge') : t('productBadge')}
            </span>
            <h2 className="text-lg font-bold text-slate-100 line-clamp-1">{item.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label={t('closeCart')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 space-y-5 flex-grow">
          {/* Image & Description */}
          <div className="flex gap-4 items-start">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-xl bg-slate-900 shrink-0 border border-slate-700"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-100">{item.name}</p>
              <p className="text-sm font-bold text-purple-400">{formatCurrency(item.sellPrice)}</p>
              {item.description && (
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              )}
            </div>
          </div>

          {/* Options (Configuration metadata) */}
          {item.options && item.options.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-700/50">
              {item.options.map(opt => (
                <div key={opt.name} className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">{opt.name}</label>
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
                              ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                              : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'
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

          {/* Special Notes */}
          <div className="space-y-1.5 pt-2 border-t border-slate-700/50">
            <label className="text-xs font-semibold text-slate-300 block">{t('itemNotes')}</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('itemNotesPlaceholder')}
              rows={2}
              className="w-full text-xs bg-slate-900/60 border border-slate-700 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Quantity Selector */}
          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-300 block">{t('quantity')}</span>
              {!isService && (
                <span className="text-[11px] text-slate-400">
                  {t('available')}: {item.stock}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-700 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-1.5 text-slate-300 hover:text-white rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-slate-100">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
                className="p-1.5 text-slate-300 hover:text-white rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-700 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block">{t('total')}</span>
            <span className="text-base font-bold text-slate-100">{formatCurrency(itemTotal)}</span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
          >
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};
