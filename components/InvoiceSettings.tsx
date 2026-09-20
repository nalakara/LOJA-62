import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface InvoiceSettingsProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

const InvoiceSettings: React.FC<InvoiceSettingsProps> = ({ settings, onSave }) => {
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
      [name]: value,
    }));
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('invoiceSettingsTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="invoicePrefix" className="block text-sm font-medium text-slate-300">{t('invoicePrefix')}</label>
            <input 
                type="text" 
                id="invoicePrefix" 
                name="invoicePrefix" 
                value={formData.invoicePrefix} 
                onChange={handleChange} 
                className={formInputClass + " mt-1"} 
                placeholder={t('placeholderInvoicePrefix')} 
            />
          </div>

          <div>
            <label htmlFor="invoiceFooter" className="block text-sm font-medium text-slate-300">{t('invoiceFooter')}</label>
            <textarea 
                id="invoiceFooter" 
                name="invoiceFooter" 
                value={formData.invoiceFooter} 
                onChange={handleChange} 
                rows={3} 
                className={formTextareaClass + " mt-1"} 
                placeholder={t('placeholderInvoiceFooter')}
            ></textarea>
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

export default InvoiceSettings;