import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface SupplierFormProps {
  onSave: (supplier: Omit<Supplier, 'id'>, id?: number) => void;
  onClose: () => void;
  editingSupplier: Supplier | null;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ onSave, onClose, editingSupplier }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  });

  const isEditing = !!editingSupplier;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: editingSupplier.name,
        contactPerson: editingSupplier.contactPerson,
        phone: editingSupplier.phone,
        email: editingSupplier.email,
        address: editingSupplier.address,
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
      });
    }
  }, [editingSupplier, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
        alert(t('supplierNameRequired'));
        return;
    }
    onSave(formData, editingSupplier?.id);
  };

  const formInputClass = "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500";

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{isEditing ? t('editSupplier') : t('addNewSupplier')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300">{t('supplierName')}</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={formInputClass} required />
        </div>
        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-300">{t('contactPerson')}</label>
          <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className={formInputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300">{t('phone')}</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={formInputClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">{t('email')}</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={formInputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-300">{t('address')}</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} className={formInputClass}></textarea>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition font-semibold">
          {t('cancel')}
        </button>
        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition font-semibold">
          {isEditing ? t('updateSupplier') : t('saveSupplier')}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;