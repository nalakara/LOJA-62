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
    <div className="bg-bone-light border border-mineral rounded-xl overflow-hidden shadow-sm hover:border-coffee/50 transition-all duration-200 flex flex-col h-full group">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full bg-mineral-light overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {isService ? (
            <span className="bg-oxide text-bone font-semibold text-[11px] px-2.5 py-0.5 rounded-md shadow-sm">
              {t('serviceBadge')}
            </span>
          ) : (
            <span className="bg-bone/90 border border-mineral text-ink font-medium text-[11px] px-2 py-0.5 rounded-md backdrop-blur-sm">
              {item.categoryName}
            </span>
          )}
        </div>

        {!isService && (
          <div className="absolute top-2.5 right-2.5">
            {isAvailable ? (
              <span className="bg-bone/90 border border-olive/40 text-olive font-bold text-[11px] px-2 py-0.5 rounded-md backdrop-blur-sm">
                {t('available')}: {item.stock}
              </span>
            ) : (
              <span className="bg-bone/90 border border-danger/40 text-danger font-bold text-[11px] px-2 py-0.5 rounded-md backdrop-blur-sm">
                {t('outOfStock')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink text-sm leading-snug line-clamp-1 group-hover:text-coffee transition-colors">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-xs text-ink-muted mt-1.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-mineral/70 flex items-center justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] text-ink-muted font-medium">{t('pricePerUnit')}</p>
            <p className="text-sm font-bold text-coffee">
              {formatCurrency(item.sellPrice)}
            </p>
          </div>

          <button
            onClick={() => onSelect(item)}
            disabled={!isAvailable}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm ${
              isAvailable
                ? 'bg-coffee hover:bg-coffee-hover text-bone'
                : 'bg-mineral text-ink-faint cursor-not-allowed'
            }`}
          >
            {isAvailable ? t('selectAndConfigure') : t('outOfStock')}
          </button>
        </div>
      </div>
    </div>
  );
};
