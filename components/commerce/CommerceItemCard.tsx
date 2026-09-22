import React from 'react';
import { ProductWithDetails } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface CommerceItemCardProps {
  item: ProductWithDetails;
  formatCurrency: (amount: number) => string;
  onSelect: (item: ProductWithDetails) => void;
}

export const CommerceItemCard: React.FC<CommerceItemCardProps> = ({ item, formatCurrency, onSelect }) => {
  const { t } = useTranslation();
  const isService = item.itemType === 'service';
  const isAvailable = isService || item.stock > 0;

  return (
    <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl overflow-hidden shadow-md hover:border-slate-600 transition-all flex flex-col h-full group">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {isService ? (
            <span className="bg-sky-500/90 text-sky-950 font-bold text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow">
              {t('serviceBadge')}
            </span>
          ) : (
            <span className="bg-slate-900/80 text-slate-300 font-medium text-xs px-2.5 py-0.5 rounded-full border border-slate-700/60 backdrop-blur-sm">
              {item.categoryName}
            </span>
          )}
        </div>

        {!isService && (
          <div className="absolute top-2.5 right-2.5">
            {isAvailable ? (
              <span className="bg-emerald-950/80 text-emerald-400 font-medium text-xs px-2 py-0.5 rounded-full border border-emerald-700/50 backdrop-blur-sm">
                {t('available')}: {item.stock}
              </span>
            ) : (
              <span className="bg-red-950/80 text-red-400 font-medium text-xs px-2 py-0.5 rounded-full border border-red-700/50 backdrop-blur-sm">
                {t('outOfStock')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-100 text-base leading-snug line-clamp-1 group-hover:text-purple-300 transition-colors">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-2 mt-auto">
          <div>
            <p className="text-xs text-slate-400 font-medium">{t('pricePerUnit')}</p>
            <p className="text-base font-bold text-slate-100">
              {formatCurrency(item.sellPrice)}
            </p>
          </div>

          <button
            onClick={() => onSelect(item)}
            disabled={!isAvailable}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm ${
              isAvailable
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isAvailable ? t('selectAndConfigure') : t('outOfStock')}
          </button>
        </div>
      </div>
    </div>
  );
};
