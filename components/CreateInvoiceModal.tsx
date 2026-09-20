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

  const formInputClass = "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500";

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-100 mb-4">{t('createInvoice')}</h2>
      <p className="text-slate-400 mb-6">{t('selectCustomerForInvoice')}</p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-slate-300">{t('customer')}</label>
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
            <p className="text-sm text-amber-400 p-3 bg-amber-500/10 rounded-md border border-amber-500/20">{t('noCustomersFoundInvoice')}</p>
        )}
      </div>

      <div className="mt-6 p-4 bg-slate-800/70 rounded-lg">
        <div className="flex justify-between items-center text-lg">
            <span className="font-medium text-slate-300">{t('invoiceTotal')}</span>
            <span className="font-bold text-purple-400">{formatCurrency(cartTotal)}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition font-semibold">
          {t('cancel')}
        </button>
        <button 
          type="button" 
          onClick={handleConfirm} 
          disabled={!selectedCustomerId}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition font-semibold disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('confirmAndCreateInvoice')}
        </button>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;