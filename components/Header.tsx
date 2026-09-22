import React from 'react';
import { StoreIcon, MenuIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface HeaderProps {
  storeName: string;
  onOpenMobileNav: () => void;
}

const Header: React.FC<HeaderProps> = ({ storeName, onOpenMobileNav }) => {
  const { locale, setLocale } = useTranslation();

  return (
    <header className="bg-ink text-bone sticky top-0 z-20 border-b border-mineral/20 shadow-sm">
      <div className="px-4 md:px-8 py-3.5 flex justify-between items-center">
        {/* Left: Mobile Menu Toggle & Brand Identity */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileNav}
            className="md:hidden p-1.5 rounded-lg text-mineral hover:text-bone hover:bg-ink-muted/50 transition focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-2.5">
            <StoreIcon className="h-6 w-6 text-coffee-light md:hidden shrink-0" />
            <span className="font-bold text-base md:text-lg tracking-tight text-bone font-sans">
              {storeName || 'Loja-62'}
            </span>
          </div>
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