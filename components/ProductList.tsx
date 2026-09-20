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
        <div className={`relative group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden shadow-md transition-all duration-300 ${canAddToCart ? 'hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-400' : 'opacity-50'}`}>
            <div className="absolute top-2 right-2 bg-slate-700/80 text-slate-200 text-xs font-semibold px-2 py-1 rounded-full z-10">
                {t('stock')}: {product.stock}
            </div>
            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="p-4">
                <h3 className="font-semibold text-slate-100 truncate">{product.name}</h3>
                <p className="text-sm text-slate-400">{product.categoryName}</p>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-bold text-purple-400">{formatCurrency(product.sellPrice)}</p>
                    <button 
                        onClick={() => canAddToCart && onAddToCart(product)} 
                        disabled={!canAddToCart}
                        className={`p-2 rounded-full transition-colors duration-200 ${canAddToCart ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                        aria-label={t('addToCart')}
                    >
                        <AddToCartIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
            {!canAddToCart && (
                <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                    <span className="text-slate-300 font-bold">{t('outOfStock')}</span>
                </div>
            )}
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