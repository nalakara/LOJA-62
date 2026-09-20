import React, { useState, useEffect, useRef } from 'react';
import { StoreIcon, POSIcon, InventoryIcon, DashboardIcon, ReportsIcon, SettingsIcon, ChevronDownIcon, ContactsIcon, TruckIcon, ClipboardListIcon, AssetIcon, ReceiptIcon, FlameIcon } from './icons';
import { View } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface HeaderProps {
    currentView: View;
    onNavigate: (view: View) => void;
    storeName: string;
}

const NavButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}> = ({ isActive, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive 
                ? 'bg-purple-500/20 text-purple-300' 
                : 'text-slate-300 hover:bg-slate-700/50'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const DropdownLink: React.FC<{
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
}> = ({ onClick, label, icon }) => (
    <a
        href="#"
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md"
    >
        {icon}
        <span>{label}</span>
    </a>
);

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, storeName }) => {
  const { t, locale, setLocale } = useTranslation();
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isContactsMenuOpen, setIsContactsMenuOpen] = useState(false);
  const [isManagementMenuOpen, setIsManagementMenuOpen] = useState(false);
  const productMenuRef = useRef<HTMLDivElement>(null);
  const contactsMenuRef = useRef<HTMLDivElement>(null);
  const managementMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productMenuRef.current && !productMenuRef.current.contains(event.target as Node)) {
        setIsProductMenuOpen(false);
      }
      if (contactsMenuRef.current && !contactsMenuRef.current.contains(event.target as Node)) {
        setIsContactsMenuOpen(false);
      }
      if (managementMenuRef.current && !managementMenuRef.current.contains(event.target as Node)) {
        setIsManagementMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isProductView = ['inventory', 'categories', 'materials', 'material-categories', 'purchase-orders', 'stock-adjustments', 'production'].includes(currentView);
  const isContactsView = ['suppliers', 'customers'].includes(currentView);
  const isManagementView = ['store-profile', 'store-assets', 'invoice-settings'].includes(currentView);
  
  const handleDropdownNavigate = (view: View) => {
    onNavigate(view);
    setIsProductMenuOpen(false);
    setIsContactsMenuOpen(false);
    setIsManagementMenuOpen(false);
  }

  return (
    <header className="bg-slate-900/70 backdrop-blur-md sticky top-0 z-10 border-b border-slate-700/50">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-3">
        {/* First Line: App Name and Language Switcher */}
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <StoreIcon className="h-8 w-8 text-purple-500" />
              <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                {storeName || 'Loja-62'}
              </h1>
            </div>
            <div className="flex items-center">
                <button
                    onClick={() => setLocale('id')}
                    className={`px-3 py-2 text-sm font-semibold rounded-l-md transition-colors ${locale === 'id' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                    ID
                </button>
                <button
                    onClick={() => setLocale('en')}
                    className={`px-3 py-2 text-sm font-semibold rounded-r-md transition-colors ${locale === 'en' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                    EN
                </button>
            </div>
        </div>

        {/* Second Line: Navigation */}
        <div className="mt-3">
            <nav className="flex items-center space-x-1 p-1 bg-slate-800/50 rounded-lg flex-wrap">
                <NavButton 
                    isActive={currentView === 'pos'}
                    onClick={() => onNavigate('pos')}
                    icon={<POSIcon className="h-5 w-5" />}
                    label={t('pos')}
                />
                
                <div className="relative" ref={productMenuRef}>
                    <button
                        onClick={() => setIsProductMenuOpen(prev => !prev)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isProductView 
                                ? 'bg-purple-500/20 text-purple-300' 
                                : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                    >
                        <InventoryIcon className="h-5 w-5" />
                        <span>{t('productManagement')}</span>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isProductMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProductMenuOpen && (
                        <div className="absolute top-full mt-2 w-64 bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-1 z-20 border border-slate-700">
                            <DropdownLink onClick={() => handleDropdownNavigate('inventory')} label={t('products')} icon={<InventoryIcon className="h-5 w-5"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('categories')} label={t('productCategories')} icon={<InventoryIcon className="h-5 w-5"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('materials')} label={t('rawMaterials')} icon={<InventoryIcon className="h-5 w-5"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('material-categories')} label={t('materialCategories')} icon={<InventoryIcon className="h-5 w-5"/>} />
                            <div className="my-1 border-t border-slate-700"></div>
                            <DropdownLink onClick={() => handleDropdownNavigate('production')} label={t('productionTracking')} icon={<FlameIcon className="h-5 w-5 text-amber-400"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('purchase-orders')} label={t('purchaseOrders')} icon={<TruckIcon className="h-5 w-5"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('stock-adjustments')} label={t('stockAdjustments')} icon={<ClipboardListIcon className="h-5 w-5"/>} />
                        </div>
                    )}
                </div>

                <div className="relative" ref={contactsMenuRef}>
                    <button
                        onClick={() => setIsContactsMenuOpen(prev => !prev)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isContactsView 
                                ? 'bg-purple-500/20 text-purple-300' 
                                : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                    >
                        <ContactsIcon className="h-5 w-5" />
                        <span>{t('contacts')}</span>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isContactsMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isContactsMenuOpen && (
                        <div className="absolute top-full mt-2 w-56 bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-1 z-20 border border-slate-700">
                            <DropdownLink onClick={() => handleDropdownNavigate('customers')} label={t('customers')} icon={<ContactsIcon className="h-5 w-5"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('suppliers')} label={t('suppliers')} icon={<ContactsIcon className="h-5 w-5"/>} />
                        </div>
                    )}
                </div>
                
                <NavButton 
                    isActive={currentView === 'dashboard'}
                    onClick={() => onNavigate('dashboard')}
                    icon={<DashboardIcon className="h-5 w-5" />}
                    label={t('dashboard')}
                />
                <NavButton 
                    isActive={currentView === 'reports'}
                    onClick={() => onNavigate('reports')}
                    icon={<ReportsIcon className="h-5 w-5" />}
                    label={t('reports')}
                />
                
                <div className="relative" ref={managementMenuRef}>
                    <button
                        onClick={() => setIsManagementMenuOpen(prev => !prev)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isManagementView
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                    >
                        <SettingsIcon className="h-5 w-5" />
                        <span>{t('management')}</span>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isManagementMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isManagementMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-1 z-20 border border-slate-700">
                            <DropdownLink onClick={() => handleDropdownNavigate('store-profile')} label={t('storeProfile')} icon={<ContactsIcon className="h-5 w-5"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('store-assets')} label={t('storeAssets')} icon={<AssetIcon className="h-5 w-5"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('invoice-settings')} label={t('invoiceSettings')} icon={<ReceiptIcon className="h-5 w-5"/>} />
                        </div>
                    )}
                </div>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;