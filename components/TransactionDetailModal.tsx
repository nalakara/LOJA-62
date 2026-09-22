import React from 'react';
import { SaleTransaction, AppSettings, Customer } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface TransactionDetailModalProps {
  transaction: SaleTransaction;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  settings: AppSettings;
  customers: Customer[];
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose, formatCurrency, settings, customers }) => {
  const { t } = useTranslation();
  const customer = customers.find(c => c.id === transaction.customerId);

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2 text-ink">
      <h2 className="text-xl font-bold mb-2 text-ink">{t('transactionDetails')}</h2>
      <div className="text-xs text-ink-muted mb-6 border-b border-mineral pb-4 space-y-1">
        <p><span className="font-semibold text-ink">{t('invoice')}:</span> #{transaction.id}</p>
        <p><span className="font-semibold text-ink">{t('date')}:</span> {new Date(transaction.timestamp).toLocaleString('id-ID')}</p>
        {customer && <p><span className="font-semibold text-ink">{t('customer')}:</span> {customer.name}</p>}
        <p>
          <span className="font-semibold text-ink">{t('paymentStatus')}:</span>{' '}
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
            transaction.paymentStatus === 'paid' 
              ? 'bg-olive-subtle text-olive border border-olive/30' 
              : 'bg-oxide-subtle text-oxide border border-oxide/30'
          }`}>
            {t(transaction.paymentStatus)}
          </span>
        </p>
      </div>
      
      <div className="space-y-3">
        {transaction.items.map(item => (
          <div key={item.productId} className="flex justify-between items-center text-xs py-1 border-b border-mineral/40">
            <div>
              <p className="font-semibold text-ink">{item.name}</p>
              <p className="text-[11px] text-ink-muted">{item.quantity} x {formatCurrency(item.sellPrice)}</p>
            </div>
            <p className="font-semibold text-ink">{formatCurrency(item.quantity * item.sellPrice)}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 border-t border-mineral pt-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-ink-muted">{t('subtotal')}</span>
          <span className="font-medium text-ink">{formatCurrency(transaction.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-muted">{t('tax')} ({settings.taxRate}%)</span>
          <span className="font-medium text-ink">{formatCurrency(transaction.tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-mineral text-ink">
          <span>{t('total')}</span>
          <span className="text-coffee">{formatCurrency(transaction.total)}</span>
        </div>
      </div>
      
      <div className="mt-4 bg-mineral-light/60 border border-mineral p-3 rounded-xl text-xs text-ink-muted space-y-1">
        <div className="flex justify-between">
          <span>{t('totalCostHpp')}</span>
          <span className="text-ink">{formatCurrency(transaction.totalHpp)}</span>
        </div>
        <div className="flex justify-between font-semibold text-olive">
          <span>{t('totalProfit')}</span>
          <span>{formatCurrency(transaction.profit)}</span>
        </div>
      </div>

      {settings.invoiceFooter && (
        <div className="mt-4 border-t border-mineral pt-4 text-center text-xs text-ink-muted italic">
          <p>{settings.invoiceFooter}</p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg font-semibold text-xs transition"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
};

export default TransactionDetailModal;