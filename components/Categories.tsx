import React from 'react';
import { Category } from '../types';
import { EditIcon, TrashIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface CategoriesProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
}

const Categories: React.FC<CategoriesProps> = ({ categories, onEdit, onDelete }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('categoryManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-ink-muted">
          <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
            <tr>
              <th scope="col" className="px-6 py-3">{t('categoryName')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-mineral/60 hover:bg-bone">
                <th scope="row" className="px-6 py-4 font-semibold text-ink whitespace-nowrap">
                    {category.name}
                </th>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(category)} className="text-coffee hover:text-coffee-hover transition-colors" aria-label={`${t('edit')} ${category.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(category.id)} className="text-danger hover:text-danger-hover transition-colors" aria-label={`${t('delete')} ${category.name}`}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {categories.length === 0 && (
          <div className="text-center py-10 text-ink-muted">
              <p className="font-semibold">{t('noCategoriesFound')}</p>
              <p className="text-sm text-ink-faint">{t('pleaseAddCategory')}</p>
          </div>
      )}
    </div>
  );
};

export default Categories;