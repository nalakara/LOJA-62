import React from 'react';
import { Product, ProductWithDetails } from '../types';
import { EditIcon, TrashIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface InventoryProps {
  products: ProductWithDetails[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  formatCurrency: (amount: number) => string;
}

const Inventory: React.FC<InventoryProps> = ({ products, onEdit, onDelete, formatCurrency }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('productManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-ink-muted">
          <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
            <tr>
              <th scope="col" className="px-6 py-3">{t('productName')}</th>
              <th scope="col" className="px-6 py-3">{t('category')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('hpp')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('sellPrice')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('grossProfit')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('availableStock')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-mineral/60 hover:bg-bone">
                <th scope="row" className="px-6 py-4 font-medium text-ink whitespace-nowrap flex items-center space-x-3">
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-mineral" />
                    <span className="font-semibold text-ink">{product.name}</span>
                </th>
                <td className="px-6 py-4 text-ink-muted">{product.categoryName}</td>
                <td className="px-6 py-4 text-right text-ink-muted">{formatCurrency(product.hpp)}</td>
                <td className="px-6 py-4 text-right font-semibold text-ink">{formatCurrency(product.sellPrice)}</td>
                <td className="px-6 py-4 text-right font-semibold text-olive">{formatCurrency(product.sellPrice - product.hpp)}</td>
                <td className="px-6 py-4 text-center font-bold text-ink">{product.stock}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(product)} className="text-coffee hover:text-coffee-hover transition-colors" aria-label={`${t('edit')} ${product.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="text-danger hover:text-danger-hover transition-colors" aria-label={`${t('delete')} ${product.name}`}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && (
          <div className="text-center py-10 text-ink-muted">
              <p className="font-semibold">{t('noProductsInInventory')}</p>
              <p className="text-sm text-ink-faint">{t('pleaseAddProduct')}</p>
          </div>
      )}
    </div>
  );
};

export default Inventory;