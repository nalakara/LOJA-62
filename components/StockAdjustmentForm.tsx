import React, { useState, useEffect } from 'react';
import { StockAdjustment, RawMaterial, StockAdjustmentType, StockAdjustmentItem } from '../types';
import { AddIcon, TrashIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface StockAdjustmentFormProps {
  onSave: (adjustment: Omit<StockAdjustment, 'id' | 'date'>) => void;
  onClose: () => void;
  rawMaterials: RawMaterial[];
  adjustmentTypes: StockAdjustmentType[];
}

type FormItem = Omit<StockAdjustmentItem, 'previousStock'>;

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ onSave, onClose, rawMaterials, adjustmentTypes }) => {
  const { t } = useTranslation();
  const [type, setType] = useState<StockAdjustmentType>(adjustmentTypes[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FormItem[]>([]);

  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState('');

  useEffect(() => {
    if (rawMaterials.length > 0) {
      setSelectedMaterialId(String(rawMaterials[0].id));
    }
  }, [rawMaterials]);

  const handleAddItem = () => {
    const materialId = parseInt(selectedMaterialId, 10);
    const quantity = parseFloat(itemQuantity);

    if (!materialId || isNaN(quantity) || quantity === 0) {
      alert(t('pleaseEnterValidQuantity'));
      return;
    }

    const existingItemIndex = items.findIndex(i => i.rawMaterialId === materialId);
    if (existingItemIndex > -1) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems.filter(item => item.quantity !== 0)); // Remove if quantity becomes zero
    } else {
      setItems([...items, { rawMaterialId: materialId, quantity }]);
    }
    setItemQuantity('');
  };

  const handleRemoveItem = (materialId: number) => {
    setItems(items.filter(i => i.rawMaterialId !== materialId));
  };
  
  const getItemDetails = (id: number) => rawMaterials.find(m => m.id === id);
  
  const handleSubmit = () => {
    if (items.length === 0) {
      alert(t('adjustmentItemsRequired'));
      return;
    }
    const finalItems = items.map(item => ({
        ...item,
        previousStock: getItemDetails(item.rawMaterialId)?.stock || 0
    }));
    
    onSave({ type, notes, items: finalItems });
  };
  
  const currentSelectedItem = getItemDetails(parseInt(selectedMaterialId, 10));

  const formInputClass = "w-full px-3 py-2 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";
  const formTextareaClass = `${formInputClass} min-h-[80px]`;

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('newStockAdjustment')}</h2>
      <div className="space-y-4">
        <div>
            <label htmlFor="type" className="block text-xs font-semibold text-ink-muted mb-1">{t('adjustmentType')}</label>
            <select id="type" value={type} onChange={e => setType(e.target.value as StockAdjustmentType)} className={formInputClass}>
                {adjustmentTypes.map(adjType => (
                    <option key={adjType} value={adjType}>{t(adjType as any)}</option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-ink-muted mb-1">{t('reasonNotes')}</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className={formTextareaClass}></textarea>
        </div>

        {/* Items Section */}
        <div className="pt-4 border-t border-mineral">
            <h3 className="text-base font-bold text-ink mb-2">{t('adjustedItems')}</h3>
            <div className="space-y-2">
                {items.map(item => {
                    const material = getItemDetails(item.rawMaterialId);
                    return (
                        <div key={item.rawMaterialId} className="flex items-center justify-between bg-mineral-light/60 border border-mineral/80 p-2.5 rounded-lg">
                            <div>
                                <span className="font-semibold text-xs text-ink">{material?.name}</span>
                                <span className="text-xs text-ink-muted ml-2">({material?.unit})</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`font-bold text-base ${item.quantity > 0 ? 'text-olive' : 'text-danger'}`}>
                                    {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                                </span>
                                <button type="button" onClick={() => handleRemoveItem(item.rawMaterialId)} className="text-danger hover:text-danger-hover transition-colors">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-2 mt-4 p-3 bg-mineral-light/40 border border-mineral rounded-xl">
                <div className="md:col-span-2">
                    <label htmlFor="recipe-item" className="block text-xs font-semibold text-ink-muted mb-1">{t('rawMaterials')}</label>
                    <select id="recipe-item" value={selectedMaterialId} onChange={e => setSelectedMaterialId(e.target.value)} className={formInputClass}>
                        {rawMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <label htmlFor="quantity" className="block text-xs font-semibold text-ink-muted mb-1">{t('adjustmentQuantity')}</label>
                    <div className="flex items-center h-[38px] space-x-2">
                        <input type="number" value={itemQuantity} placeholder="e.g., -5 or 10" onChange={e => setItemQuantity(e.target.value)} className={formInputClass} step="any" />
                        <button type="button" onClick={handleAddItem} className="p-2.5 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition-colors h-full flex items-center justify-center">
                            <AddIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-[11px] text-ink-faint mt-1 absolute">{t('adjustmentQtyNegative')}</p>
                </div>
            </div>
             <p className="text-xs text-ink-muted mt-5 text-right">
                {t('currentStock')} <span className="font-semibold text-ink">{currentSelectedItem?.stock || 0} {currentSelectedItem?.unit}</span>
             </p>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg transition font-semibold text-xs">
          {t('cancel')}
        </button>
        <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition font-semibold text-xs shadow-sm">
            {t('saveAdjustment')}
        </button>
      </div>
    </div>
  );
};

export default StockAdjustmentForm;