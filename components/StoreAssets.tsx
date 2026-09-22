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
    <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('storeAssetsTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-ink-muted">
          <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
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
              <tr key={asset.id} className="border-b border-mineral/60 hover:bg-bone">
                <th scope="row" className="px-6 py-4 font-semibold text-ink whitespace-nowrap">
                    {asset.name}
                </th>
                <td className="px-6 py-4 text-xs text-ink-muted">{new Date(asset.purchaseDate).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4 text-right font-medium text-ink">{formatCurrency(asset.purchasePrice)}</td>
                <td className="px-6 py-4 text-right font-medium text-ink-muted">{formatCurrency(asset.residualValue)}</td>
                <td className="px-6 py-4 text-center font-semibold text-ink">{asset.usefulLife}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(asset)} className="text-coffee hover:text-coffee-hover transition-colors" aria-label={`${t('edit')} ${asset.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(asset.id)} className="text-danger hover:text-danger-hover transition-colors" aria-label={`${t('delete')} ${asset.name}`}>
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
          <div className="text-center py-10 text-ink-muted">
              <p className="font-semibold">{t('noStoreAssets')}</p>
              <p className="text-sm text-ink-faint">{t('pleaseAddAsset')}</p>
          </div>
      )}
    </div>
  );
};

export default StoreAssets;