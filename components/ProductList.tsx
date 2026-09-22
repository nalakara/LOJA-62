import React from 'react';
import { ProductWithDetails } from '../types';
import { AddToCartIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface ProductListProps {
  products: ProductWithDetails[];
  onAddToCart: (product: ProductWithDetails) => void;
  formatCurrency: (amount: number) => string;
}

const ProductCard: React.FC<{ product: ProductWithDetails; onAddToCart: (product: ProductWithDetails) => void; formatCurrency: (amount: number) => string; }> = ({ product, onAddToCart, formatCurrency }) => {
    const { t } = useTranslation();
    const canAddToCart = product.stock > 0;
    
    return (
        <div className={`relative group bg-bone-light border border-mineral rounded-xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col ${canAddToCart ? 'hover:border-coffee/60 hover:shadow' : 'opacity-60'}`}>
            <div className="absolute top-2 right-2 bg-bone/90 border border-mineral text-ink text-[11px] font-semibold px-2 py-0.5 rounded-md z-10 backdrop-blur-sm">
                {product.stock > 0 ? (
                  <span className="text-olive font-bold">{t('stock')}: {product.stock}</span>
                ) : (
                  <span className="text-danger font-bold">{t('outOfStock')}</span>
                )}
            </div>
            <div className="w-full h-36 bg-mineral-light overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-3.5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-semibold text-ink text-sm leading-snug line-clamp-1 group-hover:text-coffee transition-colors">{product.name}</h3>
                  <p className="text-xs text-ink-muted mt-0.5">{product.categoryName}</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-mineral/60 flex justify-between items-center">
                    <p className="text-sm font-bold text-coffee">{formatCurrency(product.sellPrice)}</p>
                    <button 
                        onClick={() => canAddToCart && onAddToCart(product)} 
                        disabled={!canAddToCart}
                        className={`p-2 rounded-lg transition-colors duration-150 ${canAddToCart ? 'bg-coffee text-bone hover:bg-coffee-hover shadow-sm' : 'bg-mineral text-ink-faint cursor-not-allowed'}`}
                        aria-label={t('addToCart')}
                    >
                        <AddToCartIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};


const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, formatCurrency }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[65vh] overflow-y-auto pr-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} formatCurrency={formatCurrency} />
      ))}
    </div>
  );
};

export default ProductList;