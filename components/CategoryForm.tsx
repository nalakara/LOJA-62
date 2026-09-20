import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface CategoryFormProps {
  onSave: (category: Omit<Category, 'id'>, id?: number) => void;
  onClose: () => void;
  editingCategory: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSave, onClose, editingCategory }) => {
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

  const formInputClass = "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500";

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{isEditing ? t('editCategory') : t('addNewCategory')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300">{t('categoryName')}</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={formInputClass} required />
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition font-semibold">
          {t('cancel')}
        </button>
        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition font-semibold">
          {isEditing ? t('updateCategory') : t('saveCategory')}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;