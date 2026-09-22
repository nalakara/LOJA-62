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

  const formInputClass = "w-full px-3 py-2 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";
  const formTextareaClass = `${formInputClass} min-h-[80px]`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-ink mb-6">{t('storeProfileTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-ink-muted mb-2">{t('storeLogo')}</label>
              <label htmlFor="logo-upload" className="cursor-pointer group block w-full aspect-square border-2 border-dashed border-mineral rounded-xl flex justify-center items-center text-ink-faint hover:border-coffee hover:text-coffee transition overflow-hidden bg-bone">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="mx-auto h-10 w-10 text-ink-faint group-hover:text-coffee transition-colors" />
                    <span className="mt-2 block text-xs font-medium">{t('clickToUploadLogo')}</span>
                  </div>
                )}
              </label>
              <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleLogoChange} />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-xs font-semibold text-ink-muted mb-1">{t('storeName')}</label>
                <input type="text" id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('exampleStoreName')} required />
              </div>
              <div>
                <label htmlFor="ownerName" className="block text-xs font-semibold text-ink-muted mb-1">{t('ownerName')}</label>
                <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderOwnerName')} />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tagline" className="block text-xs font-semibold text-ink-muted mb-1">{t('storeTagline')}</label>
              <input type="text" id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderTagline')} />
            </div>
            <div>
              <label htmlFor="storeType" className="block text-xs font-semibold text-ink-muted mb-1">{t('storeType')}</label>
              <input type="text" id="storeType" name="storeType" value={formData.storeType} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderStoreType')} />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-xs font-semibold text-ink-muted mb-1">{t('address')}</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={2} className={formTextareaClass + " mt-1"} placeholder={t('placeholderAddress')}></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-ink-muted mb-1">{t('city')}</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderCity')} />
            </div>
            <div>
              <label htmlFor="province" className="block text-xs font-semibold text-ink-muted mb-1">{t('province')}</label>
              <input type="text" id="province" name="province" value={formData.province} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('placeholderProvince')} />
            </div>
          </div>
          
          <div className="border-t border-mineral pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="taxRate" className="block text-xs font-semibold text-ink-muted mb-1">{t('taxRate')}</label>
              <input type="number" id="taxRate" name="taxRate" value={formData.taxRate} onChange={handleChange} className={formInputClass + " mt-1"} min="0" step="0.01" />
            </div>
            <div>
              <label htmlFor="currencySymbol" className="block text-xs font-semibold text-ink-muted mb-1">{t('currencySymbol')}</label>
              <input type="text" id="currencySymbol" name="currencySymbol" value={formData.currencySymbol} onChange={handleChange} className={formInputClass + " mt-1"} placeholder={t('exampleCurrency')} />
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-mineral">
            {saved && <p className="text-xs font-semibold text-olive">{t('settingsSaved')}</p>}
            <button
              type="submit"
              className="px-6 py-2 bg-coffee hover:bg-coffee-hover text-bone rounded-lg font-semibold text-xs transition shadow-sm"
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