import React, { useState, useEffect, useMemo } from 'react';
import { PurchaseOrder, Supplier, RawMaterial, PurchaseOrderItem } from '../types';
import { AddIcon, TrashIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface PurchaseOrderFormProps {
  onSave: (po: Omit<PurchaseOrder, 'id' | 'totalCost'>, id?: string) => void;
  onClose: () => void;
  editingPO: PurchaseOrder | null;
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
  formatCurrency: (amount: number) => string;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ onSave, onClose, editingPO, suppliers, rawMaterials, formatCurrency }) => {
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState<string>('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);

  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemCost, setItemCost] = useState('');

  const isEditing = !!editingPO;

  useEffect(() => {
    if (isEditing && editingPO) {
        setSupplierId(String(editingPO.supplierId));
        setExpectedDeliveryDate(editingPO.expectedDeliveryDate ? editingPO.expectedDeliveryDate.toISOString().split('T')[0] : '');
        setNotes(editingPO.notes || '');
        setItems(editingPO.items);
    } else {
        if(suppliers.length > 0) setSupplierId(String(suppliers[0].id));
        setExpectedDeliveryDate('');
        setNotes('');
        setItems([]);
    }
  }, [editingPO, isEditing, suppliers]);

  useEffect(() => {
    if(rawMaterials.length > 0 && !isEditing) {
        const firstMaterial = rawMaterials[0];
        setSelectedMaterialId(String(firstMaterial.id));
        setItemCost(String(firstMaterial.costPerUnit));
    }
  }, [rawMaterials, isEditing]);

  useEffect(() => {
    if (selectedMaterialId) {
        const material = rawMaterials.find(m => m.id === parseInt(selectedMaterialId, 10));
        if (material) {
            setItemCost(String(material.costPerUnit));
        }
    }
  }, [selectedMaterialId, rawMaterials]);

  const handleAddItem = () => {
    const materialId = parseInt(selectedMaterialId, 10);
    const quantity = parseFloat(itemQuantity);
    const cost = parseFloat(itemCost);

    if (!materialId || isNaN(quantity) || quantity <= 0 || isNaN(cost) || cost < 0) {
        alert(t('pleaseEnterValidQuantity'));
        return;
    }
    
    const existingItemIndex = items.findIndex(i => i.rawMaterialId === materialId);
    if (existingItemIndex > -1) {
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantityOrdered += quantity;
        setItems(updatedItems);
    } else {
        setItems([...items, { rawMaterialId: materialId, quantityOrdered: quantity, costPerUnit: cost, quantityReceived: 0 }]);
    }
    setItemQuantity('');
  };

  const handleRemoveItem = (materialId: number) => {
    setItems(items.filter(i => i.rawMaterialId !== materialId));
  };
  
  const getItemName = (id: number) => rawMaterials.find(m => m.id === id)?.name || 'N/A';
  
  const totalCost = useMemo(() => {
      return items.reduce((sum, item) => sum + (item.quantityOrdered * item.costPerUnit), 0);
  }, [items]);

  const handleSubmit = (status: 'draft' | 'ordered') => {
    if (!supplierId) {
        alert(t('poSupplierRequired'));
        return;
    }
    if (items.length === 0) {
        alert(t('poItemsRequired'));
        return;
    }
    onSave({
        supplierId: parseInt(supplierId, 10),
        items,
        status,
        orderDate: editingPO?.orderDate || new Date(),
        expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
        notes,
    }, editingPO?.id);
  };

  const formInputClass = "w-full px-3 py-2 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";
  const formTextareaClass = `${formInputClass} min-h-[60px]`;

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-ink mb-6">{isEditing ? t('editPurchaseOrder') : t('newPurchaseOrder')}</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="supplier" className="block text-xs font-semibold text-ink-muted mb-1">{t('selectSupplier')}</label>
                <select id="supplier" value={supplierId} onChange={e => setSupplierId(e.target.value)} className={formInputClass}>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="expectedDeliveryDate" className="block text-xs font-semibold text-ink-muted mb-1">{t('expectedDeliveryDate')}</label>
                <input type="date" id="expectedDeliveryDate" value={expectedDeliveryDate} onChange={e => setExpectedDeliveryDate(e.target.value)} className={formInputClass} />
            </div>
        </div>
        <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-ink-muted mb-1">{t('notes')}</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className={formTextareaClass}></textarea>
        </div>

        {/* Items Section */}
        <div className="pt-4 border-t border-mineral">
            <h3 className="text-base font-bold text-ink mb-2">{t('orderItems')}</h3>
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.rawMaterialId} className="flex items-center justify-between bg-mineral-light/60 border border-mineral/80 p-2.5 rounded-lg">
                        <div>
                            <span className="font-semibold text-xs text-ink">{getItemName(item.rawMaterialId)}</span>
                            <span className="text-xs text-ink-muted ml-2">{item.quantityOrdered} x {formatCurrency(item.costPerUnit)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="font-semibold text-xs text-coffee">{formatCurrency(item.quantityOrdered * item.costPerUnit)}</span>
                            <button type="button" onClick={() => handleRemoveItem(item.rawMaterialId)} className="text-danger hover:text-danger-hover transition-colors">
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-2 mt-4 p-3 bg-mineral-light/40 border border-mineral rounded-xl">
                <div className="md:col-span-2">
                    <label htmlFor="recipe-item" className="block text-xs font-semibold text-ink-muted mb-1">{t('rawMaterials')}</label>
                    <select id="recipe-item" value={selectedMaterialId} onChange={e => setSelectedMaterialId(e.target.value)} className={formInputClass}>
                        {rawMaterials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-xs font-semibold text-ink-muted mb-1">{t('quantity')}</label>
                    <input type="number" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} className={formInputClass} min="0" step="any" />
                </div>
                <div className="flex items-center h-[38px] space-x-2">
                    <input type="number" value={itemCost} onChange={e => setItemCost(e.target.value)} className={formInputClass} min="0" step="any" />
                    <button type="button" onClick={handleAddItem} className="p-2.5 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition-colors h-full flex items-center justify-center">
                        <AddIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

             <div className="mt-4 text-right bg-mineral-light/40 border border-mineral p-3 rounded-lg">
                <p className="text-sm font-semibold text-ink flex justify-between items-center">
                    <span>{t('total')}</span> 
                    <span className="text-lg font-bold text-coffee">{formatCurrency(totalCost)}</span>
                </p>
            </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg transition font-semibold text-xs">
          {t('cancel')}
        </button>
        {(!isEditing || editingPO?.status === 'draft') && (
            <>
                <button type="button" onClick={() => handleSubmit('draft')} className="px-4 py-2 bg-mineral hover:bg-mineral-dark text-ink rounded-lg transition font-semibold text-xs">
                    {t('saveAsDraft')}
                </button>
                <button type="button" onClick={() => handleSubmit('ordered')} className="px-4 py-2 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition font-semibold text-xs shadow-sm">
                    {t('saveAndOrder')}
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
