import React from 'react';
import { Customer } from '../types';
import { EditIcon, TrashIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface CustomersProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: number) => void;
}

const Customers: React.FC<CustomersProps> = ({ customers, onEdit, onDelete }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('customerManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-ink-muted">
          <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
            <tr>
              <th scope="col" className="px-6 py-3">{t('customerName')}</th>
              <th scope="col" className="px-6 py-3">{t('phone')}</th>
              <th scope="col" className="px-6 py-3">{t('email')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-mineral/60 hover:bg-bone">
                <td className="px-6 py-4 font-semibold text-ink">{customer.name}</td>
                <td className="px-6 py-4 text-ink-muted">{customer.phone}</td>
                <td className="px-6 py-4 text-ink-muted">{customer.email}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(customer)} className="text-coffee hover:text-coffee-hover transition-colors" aria-label={`${t('edit')} ${customer.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(customer.id)} className="text-danger hover:text-danger-hover transition-colors" aria-label={`${t('delete')} ${customer.name}`}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {customers.length === 0 && (
          <div className="text-center py-10 text-ink-muted">
              <p className="font-semibold">{t('noCustomers')}</p>
              <p className="text-sm text-ink-faint">{t('pleaseAddCustomer')}</p>
          </div>
      )}
    </div>
  );
};

export default Customers;