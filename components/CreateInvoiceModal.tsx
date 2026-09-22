import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface CreateInvoiceModalProps {
  customers: Customer[];
  onConfirm: (customerId: number) => void;
  onClose: () => void;
  cartTotal: number;
  formatCurrency: (amount: number) => string;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ customers, onConfirm, onClose, cartTotal, formatCurrency }) => {
  const { t } = useTranslation();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  useEffect(() => {
    if (customers.length > 0) {
      setSelectedCustomerId(String(customers[0].id));
    }
  }, [customers]);

  const handleConfirm = () => {
    if (!selectedCustomerId) {
      alert(t('pleaseSelectCustomer'));
      return;
    }
    onConfirm(parseInt(selectedCustomerId, 10));
  };

  const formInputClass = "w-full px-3 py-2 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";

  return (
    <div>
      <h2 className="text-xl font-bold text-ink mb-1">{t('createInvoice')}</h2>
      <p className="text-xs text-ink-muted mb-6">{t('selectCustomerForInvoice')}</p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="customer" className="block text-xs font-semibold text-ink-muted mb-1">{t('customer')}</label>
          <select 
            id="customer" 
            value={selectedCustomerId} 
            onChange={(e) => setSelectedCustomerId(e.target.value)} 
            className={`${formInputClass} mt-1`}
          >
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>
        {customers.length === 0 && (
          <p className="text-xs text-oxide p-3 bg-oxide-subtle rounded-lg border border-oxide/30">{t('noCustomersFoundInvoice')}</p>
        )}
      </div>

      <div className="mt-6 p-4 bg-mineral-light/60 border border-mineral rounded-xl">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-ink-muted">{t('invoiceTotal')}</span>
          <span className="font-bold text-base text-coffee">{formatCurrency(cartTotal)}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg font-semibold text-xs transition">
          {t('cancel')}
        </button>
        <button 
          type="button" 
          onClick={handleConfirm} 
          disabled={!selectedCustomerId}
          className="px-4 py-2 bg-coffee hover:bg-coffee-hover text-bone rounded-lg font-semibold text-xs transition shadow-sm disabled:bg-mineral disabled:text-ink-faint disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('confirmAndCreateInvoice')}
        </button>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;