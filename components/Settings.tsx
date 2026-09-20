import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { ImageIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface SettingsProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'taxRate' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // Hide message after 2 seconds
  };

  const formInputClass = "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500";
  const formTextareaClass = `${formInputClass} min-h-[80px]`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('storeProfileTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('storeLogo')}</label>
              <label htmlFor="logo-upload" className="cursor-pointer group block w-full aspect-square border-2 border-slate-600 border-dashed rounded-lg flex justify-center items-center text-slate-500 hover:border-purple-500 hover:text-purple-400 transition overflow-hidden bg-slate-800/50">
                  {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo Preview" className="h-full w-full object-cover" />
                  ) : (
                      <div className="text-center p-4">
                          <ImageIcon className="mx-auto h-12 w-12" />
                          <span className="mt-2 block text-xs font-medium">{t('clickToUploadLogo')}</span>
                      </div>
                  )}
              </label>
              <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleLogoChange} />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-slate-300">{t('storeName')}</label>
                <input type="text" id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('exampleStoreName')} required />
              </div>
              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-slate-300">{t('ownerName')}</label>
                <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderOwnerName')} />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-slate-300">{t('storeTagline')}</label>
              <input type="text" id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderTagline')} />
            </div>
            <div>
              <label htmlFor="storeType" className="block text-sm font-medium text-slate-300">{t('storeType')}</label>
              <input type="text" id="storeType" name="storeType" value={formData.storeType} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderStoreType')} />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-300">{t('address')}</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={2} className={formTextareaClass + " mt-1"} placeholder={t('placeholderAddress')}></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-300">{t('city')}</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderCity')} />
            </div>
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-slate-300">{t('province')}</label>
              <input type="text" id="province" name="province" value={formData.province} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderProvince')} />
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-slate-300">{t('taxRate')}</label>
              <input type="number" id="taxRate" name="taxRate" value={formData.taxRate} onChange={handleChange} className={formInputClass + " mt-1"} min="0" step="0.01" />
            </div>
            <div>
              <label htmlFor="currencySymbol" className="block text-sm font-medium text-slate-300">{t('currencySymbol')}</label>
              <input type="text" id="currencySymbol" name="currencySymbol" value={formData.currencySymbol} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('exampleCurrency')} />
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-700">
              {saved && <p className="text-sm text-green-400">{t('settingsSaved')}</p>}
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500"
              >
                {t('saveSettings')}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;