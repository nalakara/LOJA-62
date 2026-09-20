import React from 'react';
import { CartItem } from '../types';
import { MinusIcon, PlusIcon, TrashIcon, EmptyCartIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, amount: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
  onCreateInvoice: () => void;
  formatCurrency: (amount: number) => string;
  taxRate: number;
}

const Cart: React.FC<CartProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, onCreateInvoice, formatCurrency, taxRate }) => {
  const { t } = useTranslation();
  const subtotal = cartItems.reduce((acc, item) => acc + item.sellPrice * item.quantity, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 flex flex-col h-full sticky top-36">
      <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-700 pb-4 mb-4">{t('cart')}</h2>
      
      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
          <EmptyCartIcon className="h-24 w-24 text-slate-600 mb-4" />
          <p className="font-medium">{t('yourCartIsEmpty')}</p>
          <p className="text-sm">{t('pleaseSelectProducts')}</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto -mr-3 pr-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 mb-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-grow">
                <p className="font-semibold text-slate-200">{item.name}</p>
                <p className="text-sm text-slate-400">{formatCurrency(item.sellPrice)}</p>
                <div className="flex items-center mt-1">
                  <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 transition"><MinusIcon className="h-4 w-4" /></button>
                  <span className="px-3 font-medium">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 transition"><PlusIcon className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-bold text-slate-100">{formatCurrency(item.sellPrice * item.quantity)}</p>
                <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-400 mt-2 transition"><TrashIcon className="h-5 w-5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-slate-700 pt-4 mt-auto">
        <div className="space-y-2 text-slate-300">
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('tax')} ({taxRate}%)</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-slate-100 pt-2 border-t border-slate-700">
            <span>{t('total')}</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="flex space-x-3 mt-6">
            <button
                onClick={onCreateInvoice}
                disabled={cartItems.length === 0}
                className="w-full bg-slate-700 text-slate-200 font-bold py-3 rounded-lg hover:bg-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t('createInvoice')}
            </button>
            <button
                onClick={onCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t('checkout')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;