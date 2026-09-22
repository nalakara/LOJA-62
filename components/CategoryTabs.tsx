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
    <div className="mb-5 border-b border-mineral">
      <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-none">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id as number | 'All')}
            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-semibold text-xs tracking-wide transition-colors duration-150
              ${
                selectedCategory === category.id
                  ? 'border-coffee text-coffee'
                  : 'border-transparent text-ink-muted hover:text-ink hover:border-mineral-dark'
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