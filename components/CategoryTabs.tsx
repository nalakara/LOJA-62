import React from 'react';
import { Category } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: number | 'All';
  onSelectCategory: (category: number | 'All') => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation();
  const allCategories = [{ id: 'All', name: t('all') }, ...categories];
  return (
    <div className="mb-6 border-b border-slate-700">
      <nav className="-mb-px flex space-x-6 overflow-x-auto">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id as number | 'All')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${
                selectedCategory === category.id
                  ? 'border-purple-400 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CategoryTabs;