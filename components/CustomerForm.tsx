import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface CustomerFormProps {
  onSave: (customer: Omit<Customer, 'id'>, id?: number) => void;
  onClose: () => void;
  editingCustomer: Customer | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSave, onClose, editingCustomer }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const isEditing = !!editingCustomer;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        email: editingCustomer.email,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
      });
    }
  }, [editingCustomer, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
        alert(t('customerNameRequired'));
        return;
    }
    onSave(formData, editingCustomer?.id);
  };

  const formInputClass = "w-full px-3 py-2 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-ink mb-6">{isEditing ? t('editCustomer') : t('addNewCustomer')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-ink-muted mb-1">{t('customerName')}</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={formInputClass} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-ink-muted mb-1">{t('phone')}</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={formInputClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-ink-muted mb-1">{t('email')}</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={formInputClass} />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg transition font-semibold text-xs">
          {t('cancel')}
        </button>
        <button type="submit" className="px-4 py-2 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition font-semibold text-xs shadow-sm">
          {isEditing ? t('updateCustomer') : t('saveCustomer')}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;