import React, { useState } from 'react';
import { CartItem, Customer } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { CloseIcon, ShoppingBagIcon } from '../icons';

interface CommerceCheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  customers: Customer[];
  formatCurrency: (amount: number) => string;
  onClose: () => void;
  onConfirmOrder: (orderDetails: {
    customerName: string;
    customerContact: string;
    customerId?: number;
    paymentMethod: string;
  }) => Promise<void>;
}

export const CommerceCheckoutModal: React.FC<CommerceCheckoutModalProps> = ({
  isOpen,
  cart,
  subtotal,
  tax,
  total,
  taxRate,
  customers,
  formatCurrency,
  onClose,
  onConfirmOrder,
}) => {
  const { t } = useTranslation();

  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'payCash' | 'payTransfer' | 'payQris'>('payTransfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectExistingCustomer = (idStr: string) => {
    setSelectedCustomerId(idStr);
    if (idStr) {
      const found = customers.find(c => c.id === parseInt(idStr, 10));
      if (found) {
        setCustomerName(found.name);
        setCustomerContact(found.phone || found.email || '');
      }
    } else {
      setCustomerName('');
      setCustomerContact('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError(t('customerNameRequired'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirmOrder({
        customerName: customerName.trim(),
        customerContact: customerContact.trim(),
        customerId: selectedCustomerId ? parseInt(selectedCustomerId, 10) : undefined,
        paymentMethod: t(paymentMethod),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-slate-100">{t('confirmAndOrder')}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label={t('closeCart')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-grow">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Quick Select from existing customer directory if available */}
          {customers && customers.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                {t('customers')} ({t('optional')})
              </label>
              <select
                value={selectedCustomerId}
                onChange={e => handleSelectExistingCustomer(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="">-- Guest / Customer Baru --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone || c.email || '-'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Customer Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              {t('customerName')} *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Contoh: Andi Pratama"
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Customer Contact */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              {t('customerContact')}
            </label>
            <input
              type="text"
              value={customerContact}
              onChange={e => setCustomerContact(e.target.value)}
              placeholder="0812xxxx atau andi@email.com"
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Payment Method Preference */}
          <div className="space-y-2 pt-2 border-t border-slate-700/50">
            <label className="text-xs font-semibold text-slate-300 block">
              {t('paymentPreference')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { key: 'payTransfer', label: t('payTransfer') },
                { key: 'payQris', label: t('payQris') },
                { key: 'payCash', label: t('payCash') },
              ].map(method => {
                const isSelected = paymentMethod === method.key;
                return (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => setPaymentMethod(method.key as any)}
                    className={`p-2.5 text-xs font-medium rounded-lg text-left border transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3.5 space-y-2 pt-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              {t('orderSummary')} ({cart.length} item)
            </p>
            <div className="max-h-28 overflow-y-auto space-y-1.5 divide-y divide-slate-800 text-xs">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-300 pt-1 first:pt-0">
                  <span className="line-clamp-1">
                    {item.name} &times; {item.quantity}
                  </span>
                  <span className="font-medium shrink-0 ml-2">
                    {formatCurrency(item.sellPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 pt-2 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{t('subtotal')}</span>
                <span className="font-medium text-slate-200">{formatCurrency(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>{t('tax')} ({taxRate}%)</span>
                  <span className="font-medium text-slate-200">{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-100 text-sm pt-1 border-t border-slate-700/60">
                <span>{t('total')}</span>
                <span className="text-purple-400">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses Pesanan...' : t('confirmAndOrder')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
