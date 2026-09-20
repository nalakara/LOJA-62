import React from 'react';
import { StockAdjustment, RawMaterial, StockAdjustmentType } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface StockAdjustmentsProps {
  adjustments: StockAdjustment[];
  rawMaterials: RawMaterial[];
}

const TypeBadge: React.FC<{ type: StockAdjustmentType }> = ({ type }) => {
    const { t } = useTranslation();
    const typeInfo = {
        wastage: { label: t('wastage'), color: 'bg-red-600 text-red-100' },
        correction: { label: t('correction'), color: 'bg-blue-600 text-blue-100' },
        'internal-use': { label: t('internalUse'), color: 'bg-yellow-600 text-yellow-100' },
        'return': { label: t('return'), color: 'bg-green-600 text-green-100' },
    }[type];

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.color}`}>
            {typeInfo.label}
        </span>
    );
};

const StockAdjustments: React.FC<StockAdjustmentsProps> = ({ adjustments, rawMaterials }) => {
  const { t } = useTranslation();

  const getItemName = (id: number) => rawMaterials.find(rm => rm.id === id)?.name || 'N/A';

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('stockAdjustmentsTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3">{t('adjustmentId')}</th>
              <th scope="col" className="px-6 py-3">{t('adjustmentDate')}</th>
              <th scope="col" className="px-6 py-3">{t('adjustmentType')}</th>
              <th scope="col" className="px-6 py-3">{t('adjustmentItems')}</th>
              <th scope="col" className="px-6 py-3">{t('notes')}</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.map((adj) => (
              <tr key={adj.id} className="border-b border-slate-700 hover:bg-slate-800/60">
                <td className="px-6 py-4 font-medium text-slate-100">{adj.id}</td>
                <td className="px-6 py-4">{new Date(adj.date).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4"><TypeBadge type={adj.type} /></td>
                <td className="px-6 py-4">
                  <ul className="text-xs space-y-1">
                    {adj.items.map(item => (
                       <li key={item.rawMaterialId}>
                           <span className={`${item.quantity > 0 ? 'text-green-400' : 'text-red-400'} font-semibold`}>
                               {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                           </span>
                           <span className="ml-2 text-slate-300">{getItemName(item.rawMaterialId)}</span>
                       </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-xs italic">{adj.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {adjustments.length === 0 && (
          <div className="text-center py-10 text-slate-400">
              <p>{t('noStockAdjustments')}</p>
              <p className="text-sm">{t('pleaseAddAdjustment')}</p>
          </div>
      )}
    </div>
  );
};

export default StockAdjustments;