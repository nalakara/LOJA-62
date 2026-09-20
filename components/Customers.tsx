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
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('customerManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3">{t('customerName')}</th>
              <th scope="col" className="px-6 py-3">{t('phone')}</th>
              <th scope="col" className="px-6 py-3">{t('email')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-slate-700 hover:bg-slate-800/60">
                <td className="px-6 py-4 font-medium text-slate-100">{customer.name}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(customer)} className="text-purple-400 hover:text-purple-300" aria-label={`${t('edit')} ${customer.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(customer.id)} className="text-red-500 hover:text-red-400" aria-label={`${t('delete')} ${customer.name}`}>
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
          <div className="text-center py-10 text-slate-400">
              <p>{t('noCustomers')}</p>
              <p className="text-sm">{t('pleaseAddCustomer')}</p>
          </div>
      )}
    </div>
  );
};

export default Customers;