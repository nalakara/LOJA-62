import React, { ReactNode } from 'react';
import { CloseIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition"
            aria-label={t('close')}
          >
            <CloseIcon className="h-6 w-6" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;