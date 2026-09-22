import React from 'react';
import { RawMaterial, RawMaterialWithDetails } from '../types';
import { EditIcon, TrashIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface RawMaterialsProps {
  materials: RawMaterialWithDetails[];
  onEdit: (material: RawMaterial) => void;
  onDelete: (materialId: number) => void;
}

const RawMaterials: React.FC<RawMaterialsProps> = ({ materials, onEdit, onDelete }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('rawMaterialManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-ink-muted">
          <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
            <tr>
              <th scope="col" className="px-6 py-3">{t('rawMaterialName')}</th>
              <th scope="col" className="px-6 py-3">{t('category')}</th>
              <th scope="col" className="px-6 py-3">{t('suppliers')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('stock')}</th>
              <th scope="col" className="px-6 py-3">{t('unit')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('buyPricePerUnit')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id} className="border-b border-mineral/60 hover:bg-bone">
                <th scope="row" className="px-6 py-4 font-semibold text-ink whitespace-nowrap">
                    {material.name}
                </th>
                <td className="px-6 py-4 text-ink-muted">{material.categoryName}</td>
                <td className="px-6 py-4 text-ink">{material.supplierName}</td>
                <td className="px-6 py-4 text-center font-bold text-ink">{material.stock}</td>
                <td className="px-6 py-4 text-ink-muted">{material.unit}</td>
                <td className="px-6 py-4 text-right font-medium text-ink">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(material.costPerUnit)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(material)} className="text-coffee hover:text-coffee-hover transition-colors" aria-label={`${t('edit')} ${material.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(material.id)} className="text-danger hover:text-danger-hover transition-colors" aria-label={`${t('delete')} ${material.name}`}>
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {materials.length === 0 && (
          <div className="text-center py-10 text-ink-muted">
              <p className="font-semibold">{t('noRawMaterials')}</p>
              <p className="text-sm text-ink-faint">{t('pleaseAddRawMaterial')}</p>
          </div>
      )}
    </div>
  );
};

export default RawMaterials;