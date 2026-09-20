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
    <div className="max-h-[80vh] overflow-y-auto pr-2 text-slate-200">
      <h2 className="text-2xl font-bold mb-2 text-slate-100">{t('transactionDetails')}</h2>
      <div className="text-sm text-slate-400 mb-6 border-b border-slate-700 pb-4">
        <p><span className="font-semibold text-slate-300">{t('invoice')}</span> {transaction.id}</p>
        <p><span className="font-semibold text-slate-300">{t('date')}:</span> {new Date(transaction.timestamp).toLocaleString('id-ID')}</p>
        {customer && <p><span className="font-semibold text-slate-300">{t('customer')}:</span> {customer.name}</p>}
        <p><span className="font-semibold text-slate-300">{t('paymentStatus')}:</span> <span className={transaction.paymentStatus === 'paid' ? 'font-medium text-green-400' : 'font-medium text-amber-400'}>{t(transaction.paymentStatus)}</span></p>
      </div>
      
      <div className="space-y-2">
        {transaction.items.map(item => (
          <div key={item.productId} className="flex justify-between items-center text-sm">
            <div>
              <p className="font-semibold text-slate-200">{item.name}</p>
              <p className="text-slate-400">{item.quantity} x {formatCurrency(item.sellPrice)}</p>
            </div>
            <p className="font-medium text-slate-200">{formatCurrency(item.quantity * item.sellPrice)}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 border-t border-slate-700 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-300">{t('subtotal')}</span>
          <span className="font-medium">{formatCurrency(transaction.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">{t('tax')} ({settings.taxRate}%)</span>
          <span className="font-medium">{formatCurrency(transaction.tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-slate-700 text-slate-100">
          <span>{t('total')}</span>
          <span>{formatCurrency(transaction.total)}</span>
        </div>
      </div>
      
      <div className="mt-4 bg-slate-800/70 p-3 rounded-md text-xs text-slate-400">
        <div className="flex justify-between">
            <span>{t('totalCostHpp')}</span>
            <span>{formatCurrency(transaction.totalHpp)}</span>
        </div>
         <div className="flex justify-between font-semibold text-green-400">
            <span>{t('totalProfit')}</span>
            <span>{formatCurrency(transaction.profit)}</span>
        </div>
      </div>

      {settings.invoiceFooter && (
        <div className="mt-4 border-t border-slate-700 pt-4 text-center text-xs text-slate-400 italic">
            <p>{settings.invoiceFooter}</p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition font-semibold"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
};

export default TransactionDetailModal;