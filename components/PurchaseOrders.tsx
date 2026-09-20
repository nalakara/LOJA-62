import React from 'react';
import { PurchaseOrder, Supplier } from '../types';
import { EditIcon, TruckIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface PurchaseOrdersProps {
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  onEdit: (po: PurchaseOrder) => void;
  onReceive: (po: PurchaseOrder) => void;
  formatCurrency: (amount: number) => string;
}

const StatusBadge: React.FC<{ status: PurchaseOrder['status'] }> = ({ status }) => {
    const { t } = useTranslation();
    const statusInfo = {
        draft: { label: t('draft'), color: 'bg-slate-600 text-slate-200' },
        ordered: { label: t('ordered'), color: 'bg-blue-600 text-blue-100' },
        'partially-received': { label: t('partiallyReceived'), color: 'bg-yellow-600 text-yellow-100' },
        completed: { label: t('completed'), color: 'bg-green-600 text-green-100' },
        cancelled: { label: t('cancelled'), color: 'bg-red-600 text-red-100' },
    }[status];

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
        </span>
    );
};

const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ purchaseOrders, suppliers, onEdit, onReceive, formatCurrency }) => {
  const { t } = useTranslation();
  
  const getSupplierName = (id: number) => suppliers.find(s => s.id === id)?.name || 'N/A';

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('poManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3">{t('poId')}</th>
              <th scope="col" className="px-6 py-3">{t('suppliers')}</th>
              <th scope="col" className="px-6 py-3">{t('orderDate')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('status')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('totalCost')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po) => (
              <tr key={po.id} className="border-b border-slate-700 hover:bg-slate-800/60">
                <th scope="row" className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">
                    {po.id}
                </th>
                <td className="px-6 py-4">{getSupplierName(po.supplierId)}</td>
                <td className="px-6 py-4">{new Date(po.orderDate).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4 text-center">
                    <StatusBadge status={po.status} />
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-200">{formatCurrency(po.totalCost)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    {po.status === 'draft' && (
                        <button onClick={() => onEdit(po)} className="text-purple-400 hover:text-purple-300" aria-label={`${t('edit')} ${po.id}`}>
                            <EditIcon className="h-5 w-5" />
                        </button>
                    )}
                    {(po.status === 'ordered' || po.status === 'partially-received') && (
                         <button onClick={() => onReceive(po)} className="flex items-center space-x-2 text-sm font-semibold bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1 rounded-md" aria-label={`${t('receive')} ${po.id}`}>
                            <TruckIcon className="h-4 w-4" />
                            <span>{t('receive')}</span>
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {purchaseOrders.length === 0 && (
          <div className="text-center py-10 text-slate-400">
              <p>{t('noPurchaseOrders')}</p>
              <p className="text-sm">{t('pleaseAddPO')}</p>
          </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
