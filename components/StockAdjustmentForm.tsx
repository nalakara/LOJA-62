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

  const formInputClass = "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500";
  const formTextareaClass = `${formInputClass} min-h-[80px]`;

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('newStockAdjustment')}</h2>
      <div className="space-y-4">
        <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-300">{t('adjustmentType')}</label>
            <select id="type" value={type} onChange={e => setType(e.target.value as StockAdjustmentType)} className={formInputClass}>
                {adjustmentTypes.map(adjType => (
                    <option key={adjType} value={adjType}>{t(adjType as any)}</option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-300">{t('reasonNotes')}</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className={formTextareaClass}></textarea>
        </div>

        {/* Items Section */}
        <div className="pt-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">{t('adjustedItems')}</h3>
            <div className="space-y-2">
                {items.map(item => {
                    const material = getItemDetails(item.rawMaterialId);
                    return (
                        <div key={item.rawMaterialId} className="flex items-center justify-between bg-slate-800/70 p-2 rounded-md">
                            <div>
                                <span className="font-medium text-slate-200">{material?.name}</span>
                                <span className="text-xs text-slate-400 ml-2">({material?.unit})</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`font-semibold text-lg ${item.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                                </span>
                                <button type="button" onClick={() => handleRemoveItem(item.rawMaterialId)} className="text-red-500 hover:text-red-400">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-2 mt-4 p-3 bg-slate-800 rounded-md">
                <div className="md:col-span-2">
                    <label htmlFor="recipe-item" className="block text-sm font-medium text-slate-300">{t('rawMaterials')}</label>
                    <select id="recipe-item" value={selectedMaterialId} onChange={e => setSelectedMaterialId(e.target.value)} className={formInputClass}>
                        {rawMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <label htmlFor="quantity" className="block text-sm font-medium text-slate-300">{t('adjustmentQuantity')}</label>
                    <div className="flex items-center h-10 space-x-2">
                        <input type="number" value={itemQuantity} placeholder="e.g., -5 or 10" onChange={e => setItemQuantity(e.target.value)} className={formInputClass} step="any" />
                        <button type="button" onClick={handleAddItem} className="p-2 bg-purple-500/20 text-purple-300 rounded-md hover:bg-purple-500/30 transition h-full">
                            <AddIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 absolute">{t('adjustmentQtyNegative')}</p>
                </div>
            </div>
             <p className="text-xs text-slate-400 mt-2 text-right">
                {t('currentStock')} <span className="font-semibold">{currentSelectedItem?.stock || 0} {currentSelectedItem?.unit}</span>
             </p>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition font-semibold">
          {t('cancel')}
        </button>
        <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition font-semibold">
            {t('saveAdjustment')}
        </button>
      </div>
    </div>
  );
};

export default StockAdjustmentForm;