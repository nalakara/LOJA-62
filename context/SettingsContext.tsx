import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppSettings } from '../types';
import * as api from '../services/api';

interface SettingsContextValue {
  settings: AppSettings;
  isLoading: boolean;
  saveSettings: (newSettings: AppSettings) => Promise<void>;
  formatCurrency: (amount: number) => string;
}

const defaultSettings: AppSettings = {
  storeName: 'Loja-62',
  ownerName: '',
  tagline: '',
  storeType: '',
  address: '',
  city: '',
  province: '',
  logoUrl: '',
  taxRate: 11,
  currencySymbol: 'Rp',
  invoicePrefix: 'INV-',
  invoiceFooter: 'Terima kasih telah berbelanja!',
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loaded = await api.getSettings();
        setSettings(loaded);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = useCallback(async (newSettings: AppSettings) => {
    await api.saveSettings(newSettings);
    setSettings(newSettings);
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return `${settings.currencySymbol} ${new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`;
  }, [settings.currencySymbol]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, saveSettings, formatCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
