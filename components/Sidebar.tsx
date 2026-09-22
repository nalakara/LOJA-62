import React, { useState } from 'react';
import {
  POSIcon,
  ShoppingBagIcon,
  InventoryIcon,
  FlameIcon,
  TruckIcon,
  ClipboardListIcon,
  ContactsIcon,
  DashboardIcon,
  ReportsIcon,
  SettingsIcon,
  AssetIcon,
  ReceiptIcon,
  ChevronDownIcon,
  CloseIcon,
  StoreIcon
} from './icons';
import { View } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  storeName: string;
}

interface NavItemProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ isActive, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
      isActive
        ? 'bg-coffee text-bone shadow-sm'
        : 'text-mineral hover:bg-ink-muted/50 hover:text-bone'
    }`}
  >
    <div className="flex items-center space-x-2.5 truncate">
      <span className={isActive ? 'text-bone' : 'text-mineral'}>{icon}</span>
      <span className="truncate">{label}</span>
    </div>
    {badge && (
      <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-oxide-subtle text-oxide font-bold uppercase">
        {badge}
      </span>
    )}
  </button>
);

interface SubNavItemProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const SubNavItem: React.FC<SubNavItemProps> = ({ isActive, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive
        ? 'text-bone bg-ink-muted/80 font-semibold'
        : 'text-mineral-light/80 hover:text-bone hover:bg-ink-muted/40'
    }`}
  >
    <span className={isActive ? 'text-coffee-light' : 'text-mineral/70'}>{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  storeName
}) => {
  const { t } = useTranslation();

  const isProductView = [
    'inventory',
    'categories',
    'materials',
    'material-categories',
    'purchase-orders',
    'stock-adjustments',
    'production'
  ].includes(currentView);

  const isContactsView = ['suppliers', 'customers'].includes(currentView);
  const isManagementView = ['store-profile', 'store-assets', 'invoice-settings'].includes(currentView);

  const [isProductExpanded, setIsProductExpanded] = useState<boolean>(true);
  const [isContactsExpanded, setIsContactsExpanded] = useState<boolean>(false);
  const [isManagementExpanded, setIsManagementExpanded] = useState<boolean>(false);

  const handleSelect = (view: View) => {
    onNavigate(view);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-ink text-bone border-r border-mineral/20 select-none">
      {/* Sidebar Header (Mobile & Desktop Identity) */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-mineral/10">
        <div className="flex items-center space-x-3 overflow-hidden">
          <StoreIcon className="h-6 w-6 text-coffee-light shrink-0" />
          <span className="font-bold text-sm tracking-tight text-bone truncate">
            {storeName || 'Loja-62'}
          </span>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1 rounded-lg text-mineral hover:text-bone hover:bg-ink-muted/50 transition"
          aria-label={t('close')}
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar">
        {/* Main Sales Operations */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
            Operasional
          </div>
          <NavItem
            isActive={currentView === 'pos'}
            onClick={() => handleSelect('pos')}
            icon={<POSIcon className="h-4 w-4" />}
            label={t('pos')}
          />
          <NavItem
            isActive={currentView === 'commerce'}
            onClick={() => handleSelect('commerce')}
            icon={<ShoppingBagIcon className="h-4 w-4" />}
            label={t('commerce')}
          />
        </div>

        {/* Product & Production Group */}
        <div className="space-y-1">
          <button
            onClick={() => setIsProductExpanded(prev => !prev)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
              isProductView && !isProductExpanded
                ? 'bg-coffee/30 text-bone'
                : 'text-mineral hover:bg-ink-muted/50 hover:text-bone'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <InventoryIcon className="h-4 w-4 text-mineral" />
              <span>{t('productManagement')}</span>
            </div>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 text-mineral transition-transform duration-200 ${
                isProductExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isProductExpanded && (
            <div className="pl-3.5 pr-1 py-1 space-y-0.5 border-l border-mineral/20 ml-4 animate-fade-in">
              <SubNavItem
                isActive={currentView === 'inventory'}
                onClick={() => handleSelect('inventory')}
                icon={<InventoryIcon className="h-3.5 w-3.5" />}
                label={t('products')}
              />
              <SubNavItem
                isActive={currentView === 'categories'}
                onClick={() => handleSelect('categories')}
                icon={<InventoryIcon className="h-3.5 w-3.5" />}
                label={t('productCategories')}
              />
              <SubNavItem
                isActive={currentView === 'materials'}
                onClick={() => handleSelect('materials')}
                icon={<InventoryIcon className="h-3.5 w-3.5" />}
                label={t('rawMaterials')}
              />
              <SubNavItem
                isActive={currentView === 'material-categories'}
                onClick={() => handleSelect('material-categories')}
                icon={<InventoryIcon className="h-3.5 w-3.5" />}
                label={t('materialCategories')}
              />
              <div className="my-1 border-t border-mineral/10"></div>
              <SubNavItem
                isActive={currentView === 'production'}
                onClick={() => handleSelect('production')}
                icon={<FlameIcon className="h-3.5 w-3.5 text-oxide" />}
                label={t('productionTracking')}
              />
              <SubNavItem
                isActive={currentView === 'purchase-orders'}
                onClick={() => handleSelect('purchase-orders')}
                icon={<TruckIcon className="h-3.5 w-3.5" />}
                label={t('purchaseOrders')}
              />
              <SubNavItem
                isActive={currentView === 'stock-adjustments'}
                onClick={() => handleSelect('stock-adjustments')}
                icon={<ClipboardListIcon className="h-3.5 w-3.5" />}
                label={t('stockAdjustments')}
              />
            </div>
          )}
        </div>

        {/* Contacts Group */}
        <div className="space-y-1">
          <button
            onClick={() => setIsContactsExpanded(prev => !prev)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
              isContactsView && !isContactsExpanded
                ? 'bg-coffee/30 text-bone'
                : 'text-mineral hover:bg-ink-muted/50 hover:text-bone'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <ContactsIcon className="h-4 w-4 text-mineral" />
              <span>{t('contacts')}</span>
            </div>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 text-mineral transition-transform duration-200 ${
                isContactsExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isContactsExpanded && (
            <div className="pl-3.5 pr-1 py-1 space-y-0.5 border-l border-mineral/20 ml-4 animate-fade-in">
              <SubNavItem
                isActive={currentView === 'customers'}
                onClick={() => handleSelect('customers')}
                icon={<ContactsIcon className="h-3.5 w-3.5" />}
                label={t('customers')}
              />
              <SubNavItem
                isActive={currentView === 'suppliers'}
                onClick={() => handleSelect('suppliers')}
                icon={<ContactsIcon className="h-3.5 w-3.5" />}
                label={t('suppliers')}
              />
            </div>
          )}
        </div>

        {/* Analytics & Reports */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
            Laporan & Data
          </div>
          <NavItem
            isActive={currentView === 'dashboard'}
            onClick={() => handleSelect('dashboard')}
            icon={<DashboardIcon className="h-4 w-4" />}
            label={t('dashboard')}
          />
          <NavItem
            isActive={currentView === 'reports'}
            onClick={() => handleSelect('reports')}
            icon={<ReportsIcon className="h-4 w-4" />}
            label={t('reports')}
          />
        </div>

        {/* Management & Configuration */}
        <div className="space-y-1">
          <button
            onClick={() => setIsManagementExpanded(prev => !prev)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
              isManagementView && !isManagementExpanded
                ? 'bg-coffee/30 text-bone'
                : 'text-mineral hover:bg-ink-muted/50 hover:text-bone'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <SettingsIcon className="h-4 w-4 text-mineral" />
              <span>{t('management')}</span>
            </div>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 text-mineral transition-transform duration-200 ${
                isManagementExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isManagementExpanded && (
            <div className="pl-3.5 pr-1 py-1 space-y-0.5 border-l border-mineral/20 ml-4 animate-fade-in">
              <SubNavItem
                isActive={currentView === 'store-profile'}
                onClick={() => handleSelect('store-profile')}
                icon={<ContactsIcon className="h-3.5 w-3.5" />}
                label={t('storeProfile')}
              />
              <SubNavItem
                isActive={currentView === 'store-assets'}
                onClick={() => handleSelect('store-assets')}
                icon={<AssetIcon className="h-3.5 w-3.5" />}
                label={t('storeAssets')}
              />
              <SubNavItem
                isActive={currentView === 'invoice-settings'}
                onClick={() => handleSelect('invoice-settings')}
                icon={<ReceiptIcon className="h-3.5 w-3.5" />}
                label={t('invoiceSettings')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar (240px) */}
      <aside className="hidden md:flex flex-col w-60 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Off-Canvas Drawer */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 md:hidden flex animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer panel */}
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-slide-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
