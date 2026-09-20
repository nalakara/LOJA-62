import React from 'react';
import { StoreAsset } from '../types';
import { EditIcon, TrashIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface StoreAssetsProps {
  assets: StoreAsset[];
  onEdit: (asset: StoreAsset) => void;
  onDelete: (assetId: number) => void;
  formatCurrency: (amount: number) => string;
}

const StoreAssets: React.FC<StoreAssetsProps> = ({ assets, onEdit, onDelete, formatCurrency }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('storeAssetsTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3">{t('assetName')}</th>
              <th scope="col" className="px-6 py-3">{t('purchaseDate')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('purchasePrice')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('residualValue')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('usefulLife')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-b border-slate-700 hover:bg-slate-800/60">
                <th scope="row" className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">
                    {asset.name}
                </th>
                <td className="px-6 py-4">{new Date(asset.purchaseDate).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4 text-right">{formatCurrency(asset.purchasePrice)}</td>
                <td className="px-6 py-4 text-right">{formatCurrency(asset.residualValue)}</td>
                <td className="px-6 py-4 text-center">{asset.usefulLife}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(asset)} className="text-purple-400 hover:text-purple-300" aria-label={`${t('edit')} ${asset.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(asset.id)} className="text-red-500 hover:text-red-400" aria-label={`${t('delete')} ${asset.name}`}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {assets.length === 0 && (
          <div className="text-center py-10 text-slate-400">
              <p>{t('noStoreAssets')}</p>
              <p className="text-sm">{t('pleaseAddAsset')}</p>
          </div>
      )}
    </div>
  );
};

export default StoreAssets;