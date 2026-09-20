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
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('productManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
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
              <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-800/60">
                <th scope="row" className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap flex items-center space-x-3">
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                    <span>{product.name}</span>
                </th>
                <td className="px-6 py-4">{product.categoryName}</td>
                <td className="px-6 py-4 text-right">{formatCurrency(product.hpp)}</td>
                <td className="px-6 py-4 text-right font-semibold text-slate-200">{formatCurrency(product.sellPrice)}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-400">{formatCurrency(product.sellPrice - product.hpp)}</td>
                <td className="px-6 py-4 text-center font-bold">{product.stock}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(product)} className="text-purple-400 hover:text-purple-300" aria-label={`${t('edit')} ${product.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-400" aria-label={`${t('delete')} ${product.name}`}>
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
          <div className="text-center py-10 text-slate-400">
              <p>{t('noProductsInInventory')}</p>
              <p className="text-sm">{t('pleaseAddProduct')}</p>
          </div>
      )}
    </div>
  );
};

export default Inventory;