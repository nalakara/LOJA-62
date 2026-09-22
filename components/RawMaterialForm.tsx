import React, { useState, useEffect } from 'react';
import { RawMaterial, Unit, RawMaterialCategory, Supplier } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface RawMaterialFormProps {
  onSave: (material: Omit<RawMaterial, 'id'>, id?: number) => void;
  onClose: () => void;
  editingMaterial: RawMaterial | null;
  units: Unit[];
  categories: RawMaterialCategory[];
  suppliers: Supplier[];
}

const RawMaterialForm: React.FC<RawMaterialFormProps> = ({ onSave, onClose, editingMaterial, units, categories, suppliers }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState<Unit>(units[0]);
  const [costPerUnit, setCostPerUnit] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [supplierId, setSupplierId] = useState<string>('');

  const isEditing = !!editingMaterial;

  useEffect(() => {
    if (categories.length > 0 && !isEditing) {
        setCategoryId(String(categories[0].id));
    }
  }, [categories, isEditing]);

  useEffect(() => {
    if (isEditing && editingMaterial) {
      setName(editingMaterial.name);
      setStock(String(editingMaterial.stock));
      setUnit(editingMaterial.unit);
      setCostPerUnit(String(editingMaterial.costPerUnit));
      setCategoryId(String(editingMaterial.categoryId));
      setSupplierId(String(editingMaterial.supplierId || ''));
    } else {
      setName('');
      setStock('');
      setUnit(units[0]);
      setCostPerUnit('');
      if (categories.length > 0) {
        setCategoryId(String(categories[0].id));
      }
      setSupplierId('');
    }
  }, [editingMaterial, units, categories, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stock || !costPerUnit || !categoryId) {
        alert(t('pleaseFillRequiredFields'));
        return;
    }
    
    onSave({
      name,
      stock: parseFloat(stock),
      unit,
      costPerUnit: parseFloat(costPerUnit),
      categoryId: parseInt(categoryId, 10),
      supplierId: supplierId ? parseInt(supplierId, 10) : undefined,
    }, editingMaterial?.id);
  };

  const formInputClass = "w-full px-3 py-2 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-ink mb-6">{isEditing ? t('editRawMaterial') : t('addRawMaterial')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-ink-muted mb-1">{t('rawMaterialName')}</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={formInputClass} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="category" className="block text-xs font-semibold text-ink-muted mb-1">{t('category')}</label>
                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={formInputClass} required>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="supplier" className="block text-xs font-semibold text-ink-muted mb-1">{t('suppliers')}</label>
                <select id="supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className={formInputClass}>
                    <option value="">{t('selectSupplierOptional')}</option>
                    {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                </select>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="stock" className="block text-xs font-semibold text-ink-muted mb-1">{t('stockAmount')}</label>
                <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} className={formInputClass} required min="0" step="any" />
            </div>
            <div>
                <label htmlFor="unit" className="block text-xs font-semibold text-ink-muted mb-1">{t('unit')}</label>
                <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className={formInputClass}>
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
        </div>
        <div>
          <label htmlFor="costPerUnit" className="block text-xs font-semibold text-ink-muted mb-1">{t('buyPricePerUnit')} (Rp)</label>
          <input type="number" id="costPerUnit" value={costPerUnit} onChange={(e) => setCostPerUnit(e.target.value)} className={formInputClass} required min="0" step="any" />
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg transition font-semibold text-xs">
          {t('cancel')}
        </button>
        <button type="submit" className="px-4 py-2 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition font-semibold text-xs shadow-sm">
          {isEditing ? t('updateMaterial') : t('saveMaterial')}
        </button>
      </div>
    </form>
  );
};

export default RawMaterialForm;