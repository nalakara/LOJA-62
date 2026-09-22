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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-bone-light border border-mineral rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up text-ink">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-mineral bg-bone">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5 text-coffee" />
            <h2 className="text-base font-bold text-ink">{t('confirmAndOrder')}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-faint hover:text-ink p-1 rounded-lg hover:bg-mineral/40 transition-colors"
            aria-label={t('closeCart')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-grow">
          {error && (
            <div className="p-3 bg-danger-subtle border border-danger/40 rounded-xl text-xs text-danger font-medium">
              {error}
            </div>
          )}

          {/* Quick Select from existing customer directory if available */}
          {customers && customers.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink block">
                {t('customers')} ({t('optional')})
              </label>
              <select
                value={selectedCustomerId}
                onChange={e => handleSelectExistingCustomer(e.target.value)}
                className="w-full text-xs bg-bone border border-mineral rounded-lg p-2.5 text-ink focus:outline-none focus:border-coffee"
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
            <label className="text-xs font-semibold text-ink block">
              {t('customerFullName')} *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Contoh: Andi Pratama"
              className="w-full text-xs bg-bone border border-mineral rounded-lg p-2.5 text-ink placeholder-ink-faint focus:outline-none focus:border-coffee"
            />
          </div>

          {/* Customer Contact */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink block">
              {t('customerContact')}
            </label>
            <input
              type="text"
              value={customerContact}
              onChange={e => setCustomerContact(e.target.value)}
              placeholder="0812xxxx atau andi@email.com"
              className="w-full text-xs bg-bone border border-mineral rounded-lg p-2.5 text-ink placeholder-ink-faint focus:outline-none focus:border-coffee"
            />
          </div>

          {/* Payment Method Preference */}
          <div className="space-y-2 pt-2 border-t border-mineral/70">
            <label className="text-xs font-semibold text-ink block">
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
                        ? 'bg-coffee text-bone border-coffee shadow-sm'
                        : 'bg-bone border-mineral text-ink-muted hover:border-mineral-dark hover:text-ink'
                    }`}
                  >
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-bone border border-mineral rounded-xl p-3.5 space-y-2 pt-3">
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
              {t('orderSummary')} ({cart.length} item)
            </p>
            <div className="max-h-28 overflow-y-auto space-y-1.5 divide-y divide-mineral text-xs">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-ink pt-1 first:pt-0">
                  <span className="line-clamp-1">
                    {item.name} &times; {item.quantity}
                  </span>
                  <span className="font-semibold shrink-0 ml-2 text-coffee">
                    {formatCurrency(item.sellPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-mineral pt-2 space-y-1 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-ink">{formatCurrency(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-ink-muted">
                  <span>{t('tax')} ({taxRate}%)</span>
                  <span className="font-semibold text-ink">{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-ink text-sm pt-1 border-t border-mineral">
                <span>{t('total')}</span>
                <span className="text-coffee">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-coffee hover:bg-coffee-hover text-bone font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses Pesanan...' : t('confirmAndOrder')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
