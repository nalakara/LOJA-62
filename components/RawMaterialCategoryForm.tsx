import React, { useState, useEffect } from 'react';
import { RawMaterialCategory } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface RawMaterialCategoryFormProps {
  onSave: (category: Omit<RawMaterialCategory, 'id'>, id?: number) => void;
  onClose: () => void;
  editingCategory: RawMaterialCategory | null;
}

const RawMaterialCategoryForm: React.FC<RawMaterialCategoryFormProps> = ({ onSave, onClose, editingCategory }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const isEditing = !!editingCategory;

  useEffect(() => {
    if (isEditing) {
      setName(editingCategory.name);
    } else {
      setName('');
    }
  }, [editingCategory, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
        alert(t('categoryNameRequired'));
        return;
    }
    onSave({ name }, editingCategory?.id);
  };

  const formInputClass = "w-full px-3 py-2 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-ink mb-6">{isEditing ? t('editMaterialCategory') : t('addMaterialCategory')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-ink-muted mb-1">{t('categoryName')}</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={formInputClass} required />
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg transition font-semibold text-xs">
          {t('cancel')}
        </button>
        <button type="submit" className="px-4 py-2 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition font-semibold text-xs shadow-sm">
          {isEditing ? t('updateCategory') : t('saveCategory')}
        </button>
      </div>
    </form>
  );
};

export default RawMaterialCategoryForm;