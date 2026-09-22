import React from 'react';
import { MenuIcon } from './icons';
import { View } from '../types';
import { useTranslation, TranslationKey } from '../context/LanguageContext';

interface HeaderProps {
  currentView: View;
  onOpenMobileNav: () => void;
}

// Map any view (parent or child) to its mother/top-level navigation context translation key
const VIEW_CONTEXT_MAP: Record<View, TranslationKey> = {
  pos: 'pos',
  commerce: 'commerce',
  inventory: 'productManagement',
  categories: 'productManagement',
  materials: 'productManagement',
  'material-categories': 'productManagement',
  production: 'productManagement',
  'purchase-orders': 'productManagement',
  'stock-adjustments': 'productManagement',
  customers: 'contacts',
  suppliers: 'contacts',
  dashboard: 'dashboard',
  reports: 'reports',
  'store-profile': 'management',
  'store-assets': 'management',
  'invoice-settings': 'management',
};

const Header: React.FC<HeaderProps> = ({ currentView, onOpenMobileNav }) => {
  const { t, locale, setLocale } = useTranslation();

  const contextKey = VIEW_CONTEXT_MAP[currentView] || 'pos';
  const contextTitle = t(contextKey);

  return (
    <header className="bg-ink text-bone sticky top-0 z-20 border-b border-mineral/20 shadow-sm">
      <div className="px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Left: Mobile Menu Toggle & Contextual Navigation Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileNav}
            className="md:hidden p-1.5 rounded-lg text-mineral hover:text-bone hover:bg-ink-muted/50 transition focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          
          <h1 className="font-semibold text-sm md:text-base text-bone tracking-wide font-sans">
            {contextTitle}
          </h1>
        </div>

        {/* Right: Language Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-ink-muted/60 p-0.5 rounded-lg border border-mineral/20">
            <button
              onClick={() => setLocale('id')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                locale === 'id' ? 'bg-coffee text-bone shadow-sm' : 'text-mineral hover:text-bone'
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                locale === 'en' ? 'bg-coffee text-bone shadow-sm' : 'text-mineral hover:text-bone'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;