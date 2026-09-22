import React, { useState, useEffect, useRef } from 'react';
import { StoreIcon, POSIcon, InventoryIcon, DashboardIcon, ReportsIcon, SettingsIcon, ChevronDownIcon, ContactsIcon, TruckIcon, ClipboardListIcon, AssetIcon, ReceiptIcon, FlameIcon, ShoppingBagIcon } from './icons';
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
        className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
            isActive 
                ? 'bg-coffee text-bone shadow-sm' 
                : 'text-mineral-light hover:bg-ink-muted/50 hover:text-bone'
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
        className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-mineral hover:text-bone hover:bg-ink-muted/50 rounded-lg transition-colors"
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
    <header className="bg-ink text-bone sticky top-0 z-30 border-b border-ink-dark/80 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-3">
        {/* First Line: App Name and Language Switcher */}
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <StoreIcon className="h-7 w-7 text-coffee-light" />
              <h1 className="text-xl md:text-2xl font-bold text-bone tracking-tight font-sans">
                {storeName || 'Loja-62'}
              </h1>
            </div>
            <div className="flex items-center bg-ink-dark/80 p-0.5 rounded-lg border border-mineral/20">
                <button
                    onClick={() => setLocale('id')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${locale === 'id' ? 'bg-coffee text-bone' : 'text-mineral hover:text-bone'}`}
                >
                    ID
                </button>
                <button
                    onClick={() => setLocale('en')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${locale === 'en' ? 'bg-coffee text-bone' : 'text-mineral hover:text-bone'}`}
                >
                    EN
                </button>
            </div>
        </div>

        {/* Second Line: Navigation */}
        <div className="mt-2.5">
            <nav className="flex items-center space-x-1 p-1 bg-ink-dark/60 rounded-xl border border-mineral/10 flex-wrap gap-y-1">
                <NavButton 
                    isActive={currentView === 'pos'}
                    onClick={() => onNavigate('pos')}
                    icon={<POSIcon className="h-4 w-4" />}
                    label={t('pos')}
                />
                
                <NavButton 
                    isActive={currentView === 'commerce'}
                    onClick={() => onNavigate('commerce')}
                    icon={<ShoppingBagIcon className="h-4 w-4" />}
                    label={t('commerce')}
                />
                
                <div className="relative" ref={productMenuRef}>
                    <button
                        onClick={() => setIsProductMenuOpen(prev => !prev)}
                        className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                            isProductView 
                                ? 'bg-coffee text-bone shadow-sm' 
                                : 'text-mineral-light hover:bg-ink-muted/50 hover:text-bone'
                        }`}
                    >
                        <InventoryIcon className="h-4 w-4" />
                        <span>{t('productManagement')}</span>
                        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${isProductMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProductMenuOpen && (
                        <div className="absolute top-full mt-1.5 w-64 bg-ink border border-mineral/30 rounded-xl shadow-xl p-1.5 z-40 animate-fade-in">
                            <DropdownLink onClick={() => handleDropdownNavigate('inventory')} label={t('products')} icon={<InventoryIcon className="h-4 w-4 text-mineral"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('categories')} label={t('productCategories')} icon={<InventoryIcon className="h-4 w-4 text-mineral"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('materials')} label={t('rawMaterials')} icon={<InventoryIcon className="h-4 w-4 text-mineral"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('material-categories')} label={t('materialCategories')} icon={<InventoryIcon className="h-4 w-4 text-mineral"/>} />
                            <div className="my-1 border-t border-mineral/20"></div>
                            <DropdownLink onClick={() => handleDropdownNavigate('production')} label={t('productionTracking')} icon={<FlameIcon className="h-4 w-4 text-oxide"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('purchase-orders')} label={t('purchaseOrders')} icon={<TruckIcon className="h-4 w-4 text-mineral"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('stock-adjustments')} label={t('stockAdjustments')} icon={<ClipboardListIcon className="h-4 w-4 text-mineral"/>} />
                        </div>
                    )}
                </div>

                <div className="relative" ref={contactsMenuRef}>
                    <button
                        onClick={() => setIsContactsMenuOpen(prev => !prev)}
                        className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                            isContactsView 
                                ? 'bg-coffee text-bone shadow-sm' 
                                : 'text-mineral-light hover:bg-ink-muted/50 hover:text-bone'
                        }`}
                    >
                        <ContactsIcon className="h-4 w-4" />
                        <span>{t('contacts')}</span>
                        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${isContactsMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isContactsMenuOpen && (
                        <div className="absolute top-full mt-1.5 w-56 bg-ink border border-mineral/30 rounded-xl shadow-xl p-1.5 z-40 animate-fade-in">
                            <DropdownLink onClick={() => handleDropdownNavigate('customers')} label={t('customers')} icon={<ContactsIcon className="h-4 w-4 text-mineral"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('suppliers')} label={t('suppliers')} icon={<ContactsIcon className="h-4 w-4 text-mineral"/>} />
                        </div>
                    )}
                </div>
                
                <NavButton 
                    isActive={currentView === 'dashboard'}
                    onClick={() => onNavigate('dashboard')}
                    icon={<DashboardIcon className="h-4 w-4" />}
                    label={t('dashboard')}
                />
                <NavButton 
                    isActive={currentView === 'reports'}
                    onClick={() => onNavigate('reports')}
                    icon={<ReportsIcon className="h-4 w-4" />}
                    label={t('reports')}
                />
                
                <div className="relative" ref={managementMenuRef}>
                    <button
                        onClick={() => setIsManagementMenuOpen(prev => !prev)}
                        className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                            isManagementView
                                ? 'bg-coffee text-bone shadow-sm'
                                : 'text-mineral-light hover:bg-ink-muted/50 hover:text-bone'
                        }`}
                    >
                        <SettingsIcon className="h-4 w-4" />
                        <span>{t('management')}</span>
                        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${isManagementMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isManagementMenuOpen && (
                        <div className="absolute top-full right-0 mt-1.5 w-56 bg-ink border border-mineral/30 rounded-xl shadow-xl p-1.5 z-40 animate-fade-in">
                            <DropdownLink onClick={() => handleDropdownNavigate('store-profile')} label={t('storeProfile')} icon={<ContactsIcon className="h-4 w-4 text-mineral"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('store-assets')} label={t('storeAssets')} icon={<AssetIcon className="h-4 w-4 text-mineral"/>} />
                            <DropdownLink onClick={() => handleDropdownNavigate('invoice-settings')} label={t('invoiceSettings')} icon={<ReceiptIcon className="h-4 w-4 text-mineral"/>} />
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