import React, { useState, useMemo } from 'react';
import { PurchaseOrder, RawMaterial } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface ReceivePOModalProps {
  purchaseOrder: PurchaseOrder;
  onReceive: (poId: string, itemsToReceive: { rawMaterialId: number, quantity: number }[]) => void;
  onClose: () => void;
  rawMaterials: RawMaterial[];
}

const ReceivePOModal: React.FC<ReceivePOModalProps> = ({ purchaseOrder, onReceive, onClose, rawMaterials }) => {
  const { t } = useTranslation();
  const [receiveQuantities, setReceiveQuantities] = useState<Record<number, number | string>>({});

  const itemsToProcess = useMemo(() => {
    return purchaseOrder.items.filter(item => item.quantityOrdered > item.quantityReceived);
  }, [purchaseOrder]);

  const handleQuantityChange = (materialId: number, value: string) => {
    const poItem = purchaseOrder.items.find(i => i.rawMaterialId === materialId);
    if (!poItem) return;

    const maxReceivable = poItem.quantityOrdered - poItem.quantityReceived;
    const numValue = value === '' ? '' : parseFloat(value);
    
    if (numValue === '' || (numValue >= 0 && numValue <= maxReceivable)) {
      setReceiveQuantities(prev => ({ ...prev, [materialId]: numValue }));
    }
  };
  
  const handleReceiveAll = () => {
      const allQuantities: Record<number, number> = {};
      itemsToProcess.forEach(item => {
          allQuantities[item.rawMaterialId] = item.quantityOrdered - item.quantityReceived;
      });
      setReceiveQuantities(allQuantities);
  };

  const handleSubmit = () => {
    const itemsToReceive = Object.entries(receiveQuantities)
      .map(([materialId, quantity]) => ({
        rawMaterialId: parseInt(materialId, 10),
        quantity: typeof quantity === 'string' ? parseFloat(quantity) : quantity,
      }))
      // Fix: Explicitly convert quantity to a number before comparison to avoid type errors.
      .filter(item => Number(item.quantity) > 0);

    if (itemsToReceive.length === 0) {
      alert(t('noItemsToReceive'));
      return;
    }
    
    onReceive(purchaseOrder.id, itemsToReceive);
  };

  const getItemName = (id: number) => rawMaterials.find(m => m.id === id)?.name || 'N/A';
  const formInputClass = "w-full px-3 py-1.5 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-ink mb-1">{t('receiveStock')}</h2>
      <p className="text-xs text-ink-muted mb-6">{t('receiveItemsForPO')} <span className="font-semibold text-ink">{purchaseOrder.id}</span></p>

      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-4 text-[11px] font-bold uppercase text-ink-muted px-2">
            <div className="col-span-2">{t('item')}</div>
            <div className="text-center">{t('ordered')} / {t('received')}</div>
            <div className="text-center">{t('receiveNow')}</div>
        </div>

        {itemsToProcess.map(item => {
            const maxReceivable = item.quantityOrdered - item.quantityReceived;
            return (
                <div key={item.rawMaterialId} className="grid grid-cols-4 gap-4 items-center bg-mineral-light/60 border border-mineral/80 p-2.5 rounded-lg">
                    <div className="col-span-2 font-semibold text-xs text-ink">{getItemName(item.rawMaterialId)}</div>
                    <div className="text-center text-xs text-ink-muted">
                        {item.quantityOrdered} / <span className="text-olive font-semibold">{item.quantityReceived}</span>
                    </div>
                    <div>
                        <input
                            type="number"
                            value={receiveQuantities[item.rawMaterialId] ?? ''}
                            onChange={e => handleQuantityChange(item.rawMaterialId, e.target.value)}
                            className={`${formInputClass} text-center font-semibold`}
                            max={maxReceivable}
                            min="0"
                            step="any"
                            placeholder="0"
                        />
                    </div>
                </div>
            );
        })}
      </div>
      
      {itemsToProcess.length === 0 && (
          <div className="text-center py-10 text-ink-muted">
              <p className="font-semibold">{t('noItemsToReceive')}</p>
          </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <button type="button" onClick={handleReceiveAll} className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg transition font-semibold text-xs">
            {t('receiveAll')}
        </button>
        <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg transition font-semibold text-xs">
              {t('cancel')}
            </button>
            <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition font-semibold text-xs shadow-sm">
              {t('confirmReceive')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReceivePOModal;