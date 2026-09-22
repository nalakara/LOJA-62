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
        wastage: { label: t('wastage'), color: 'bg-danger-subtle text-danger border border-danger/30' },
        correction: { label: t('correction'), color: 'bg-mineral-light text-ink border border-mineral' },
        'internal-use': { label: t('internalUse'), color: 'bg-oxide-subtle text-oxide border border-oxide/30' },
        'return': { label: t('return'), color: 'bg-olive-subtle text-olive border border-olive/30' },
    }[type];

    return (
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${typeInfo.color}`}>
            {typeInfo.label}
        </span>
    );
};

const StockAdjustments: React.FC<StockAdjustmentsProps> = ({ adjustments, rawMaterials }) => {
  const { t } = useTranslation();

  const getItemName = (id: number) => rawMaterials.find(rm => rm.id === id)?.name || 'N/A';

  return (
    <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('stockAdjustmentsTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-ink-muted">
          <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
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
              <tr key={adj.id} className="border-b border-mineral/60 hover:bg-bone">
                <td className="px-6 py-4 font-semibold text-ink">{adj.id}</td>
                <td className="px-6 py-4 text-xs text-ink-muted">{new Date(adj.date).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4"><TypeBadge type={adj.type} /></td>
                <td className="px-6 py-4">
                  <ul className="text-xs space-y-1">
                    {adj.items.map(item => (
                       <li key={item.rawMaterialId}>
                           <span className={`${item.quantity > 0 ? 'text-olive' : 'text-danger'} font-bold`}>
                               {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                           </span>
                           <span className="ml-2 text-ink">{getItemName(item.rawMaterialId)}</span>
                       </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-xs italic text-ink-muted">{adj.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {adjustments.length === 0 && (
          <div className="text-center py-10 text-ink-muted">
              <p className="font-semibold">{t('noStockAdjustments')}</p>
              <p className="text-sm text-ink-faint">{t('pleaseAddAdjustment')}</p>
          </div>
      )}
    </div>
  );
};

export default StockAdjustments;