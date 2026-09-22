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
    <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('supplierManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-ink-muted">
          <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
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
              <tr key={supplier.id} className="border-b border-mineral/60 hover:bg-bone">
                <td className="px-6 py-4 font-semibold text-ink">{supplier.name}</td>
                <td className="px-6 py-4 text-ink-muted">{supplier.contactPerson}</td>
                <td className="px-6 py-4 text-ink-muted">{supplier.phone}</td>
                <td className="px-6 py-4 text-ink-muted">{supplier.email}</td>
                <td className="px-6 py-4 text-ink-muted">{supplier.address}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(supplier)} className="text-coffee hover:text-coffee-hover transition-colors" aria-label={`${t('edit')} ${supplier.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(supplier.id)} className="text-danger hover:text-danger-hover transition-colors" aria-label={`${t('delete')} ${supplier.name}`}>
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
          <div className="text-center py-10 text-ink-muted">
              <p className="font-semibold">{t('noSuppliers')}</p>
              <p className="text-sm text-ink-faint">{t('pleaseAddSupplier')}</p>
          </div>
      )}
    </div>
  );
};

export default Suppliers;