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

  const formInputClass = "w-full px-3 py-2 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";
  const formTextareaClass = `${formInputClass} min-h-[80px]`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-ink mb-6">{t('invoiceSettingsTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="invoicePrefix" className="block text-xs font-semibold text-ink-muted mb-1">{t('invoicePrefix')}</label>
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
            <label htmlFor="invoiceFooter" className="block text-xs font-semibold text-ink-muted mb-1">{t('invoiceFooter')}</label>
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

export default InvoiceSettings;