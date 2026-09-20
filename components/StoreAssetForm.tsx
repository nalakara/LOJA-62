import React, { useState, useEffect } from 'react';
import { StoreAsset } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface StoreAssetFormProps {
  onSave: (asset: Omit<StoreAsset, 'id'>, id?: number) => void;
  onClose: () => void;
  editingAsset: StoreAsset | null;
  formatCurrency: (amount: number) => string;
}

const StoreAssetForm: React.FC<StoreAssetFormProps> = ({ onSave, onClose, editingAsset }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [residualValue, setResidualValue] = useState('');
  const [usefulLife, setUsefulLife] = useState('');

  const isEditing = !!editingAsset;

  useEffect(() => {
    if (isEditing && editingAsset) {
      setName(editingAsset.name);
      setPurchaseDate(new Date(editingAsset.purchaseDate).toISOString().split('T')[0]);
      setPurchasePrice(String(editingAsset.purchasePrice));
      setResidualValue(String(editingAsset.residualValue));
      setUsefulLife(String(editingAsset.usefulLife));
    } else {
      setName('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setPurchasePrice('');
      setResidualValue('0');
      setUsefulLife('');
    }
  }, [editingAsset, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purchaseDate || !purchasePrice || !residualValue || !usefulLife) {
        alert(t('pleaseFillRequiredFields'));
        return;
    }
    
    onSave({
      name,
      purchaseDate: new Date(purchaseDate),
      purchasePrice: parseFloat(purchasePrice),
      residualValue: parseFloat(residualValue),
      usefulLife: parseFloat(usefulLife),
    }, editingAsset?.id);
  };

  const formInputClass = "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500";

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{isEditing ? t('editAsset') : t('addNewAsset')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300">{t('assetName')}</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={formInputClass} required />
        </div>
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-slate-300">{t('purchaseDate')}</label>
          <input type="date" id="purchaseDate" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className={formInputClass} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-slate-300">{t('purchasePrice')}</label>
            <input type="number" id="purchasePrice" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className={formInputClass} required min="0" />
          </div>
          <div>
            <label htmlFor="residualValue" className="block text-sm font-medium text-slate-300">{t('residualValue')}</label>
            <input type="number" id="residualValue" value={residualValue} onChange={(e) => setResidualValue(e.target.value)} className={formInputClass} required min="0" />
          </div>
        </div>
        <div>
          <label htmlFor="usefulLife" className="block text-sm font-medium text-slate-300">{t('usefulLife')}</label>
          <input type="number" id="usefulLife" value={usefulLife} onChange={(e) => setUsefulLife(e.target.value)} className={formInputClass} required min="0" />
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition font-semibold">
          {t('cancel')}
        </button>
        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition font-semibold">
          {isEditing ? t('updateAsset') : t('saveAsset')}
        </button>
      </div>
    </form>
  );
};

export default StoreAssetForm;