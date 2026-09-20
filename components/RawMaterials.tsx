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
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('rawMaterialManagementTitle')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
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
              <tr key={material.id} className="border-b border-slate-700 hover:bg-slate-800/60">
                <th scope="row" className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">
                    {material.name}
                </th>
                <td className="px-6 py-4">{material.categoryName}</td>
                <td className="px-6 py-4">{material.supplierName}</td>
                <td className="px-6 py-4 text-center font-semibold">{material.stock}</td>
                <td className="px-6 py-4">{material.unit}</td>
                <td className="px-6 py-4 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(material.costPerUnit)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <button onClick={() => onEdit(material)} className="text-purple-400 hover:text-purple-300" aria-label={`${t('edit')} ${material.name}`}>
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(material.id)} className="text-red-500 hover:text-red-400" aria-label={`${t('delete')} ${material.name}`}>
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
          <div className="text-center py-10 text-slate-400">
              <p>{t('noRawMaterials')}</p>
              <p className="text-sm">{t('pleaseAddRawMaterial')}</p>
          </div>
      )}
    </div>
  );
};

export default RawMaterials;