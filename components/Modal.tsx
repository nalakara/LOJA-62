import React, { ReactNode, useEffect } from 'react';
import { CloseIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/60 backdrop-blur-[2px] z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-bone-light rounded-xl shadow-xl w-full max-w-md transform transition-all border border-mineral overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative text-ink">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-ink-faint hover:text-ink hover:bg-mineral/40 p-1 rounded-lg transition-colors"
            aria-label={t('close')}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;