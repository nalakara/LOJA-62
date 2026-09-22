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
        draft: { label: t('draft'), color: 'bg-mineral-light text-ink-muted border border-mineral' },
        ordered: { label: t('ordered'), color: 'bg-oxide-subtle text-oxide border border-oxide/30' },
        'partially-received': { label: t('partiallyReceived'), color: 'bg-coffee/10 text-coffee border border-coffee/30' },
        completed: { label: t('completed'), color: 'bg-olive-subtle text-olive border border-olive/30' },
        cancelled: { label: t('cancelled'), color: 'bg-danger-subtle text-danger border border-danger/30' },
    }[status];

    return (
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
        </span>
    );
};

const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ purchaseOrders, suppliers, onEdit, onReceive, formatCurrency }) => {
  const { t } = useTranslation();
  
  const getSupplierName = (id: number) => suppliers.find(s => s.id === id)?.name || 'N/A';

  return (
    <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('poManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-ink-muted">
          <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
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
              <tr key={po.id} className="border-b border-mineral/60 hover:bg-bone">
                <th scope="row" className="px-6 py-4 font-semibold text-ink whitespace-nowrap">
                    {po.id}
                </th>
                <td className="px-6 py-4 text-ink">{getSupplierName(po.supplierId)}</td>
                <td className="px-6 py-4 text-ink-muted text-xs">{new Date(po.orderDate).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4 text-center">
                    <StatusBadge status={po.status} />
                </td>
                <td className="px-6 py-4 text-right font-semibold text-ink">{formatCurrency(po.totalCost)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    {po.status === 'draft' && (
                        <button onClick={() => onEdit(po)} className="text-coffee hover:text-coffee-hover transition-colors" aria-label={`${t('edit')} ${po.id}`}>
                            <EditIcon className="h-5 w-5" />
                        </button>
                    )}
                    {(po.status === 'ordered' || po.status === 'partially-received') && (
                         <button onClick={() => onReceive(po)} className="flex items-center space-x-1.5 text-xs font-semibold bg-olive-subtle text-olive border border-olive/30 hover:bg-olive/20 px-3 py-1.5 rounded-lg transition-colors" aria-label={`${t('receive')} ${po.id}`}>
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
          <div className="text-center py-10 text-ink-muted">
              <p className="font-semibold">{t('noPurchaseOrders')}</p>
              <p className="text-sm text-ink-faint">{t('pleaseAddPO')}</p>
          </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
