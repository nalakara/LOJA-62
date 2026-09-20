import React from 'react';
import { Supplier } from '../types';
import { EditIcon, TrashIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface SuppliersProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: number) => void;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onEdit, onDelete }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('supplierManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3">{t('supplierName')}</th>
              <th scope="col" className="px-6 py-3">{t('contactPerson')}</th>
              <th scope="col" className="px-6 py-3">{t('phone')}</th>
              <th scope="col" className="px-6 py-3">{t('email')}</th>
              <th scope="col" className="px-6 py-3">{t('address')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b border-slate-700 hover:bg-slate-800/60">
                <td className="px-6 py-4 font-medium text-slate-100">{supplier.name}</td>
                <td className="px-6 py-4">{supplier.contactPerson}</td>
                <td className="px-6 py-4">{supplier.phone}</td>
                <td className="px-6 py-4">{supplier.email}</td>
                <td className="px-6 py-4">{supplier.address}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(supplier)} className="text-purple-400 hover:text-purple-300" aria-label={`${t('edit')} ${supplier.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(supplier.id)} className="text-red-500 hover:text-red-400" aria-label={`${t('delete')} ${supplier.name}`}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {suppliers.length === 0 && (
          <div className="text-center py-10 text-slate-400">
              <p>{t('noSuppliers')}</p>
              <p className="text-sm">{t('pleaseAddSupplier')}</p>
          </div>
      )}
    </div>
  );
};

export default Suppliers;