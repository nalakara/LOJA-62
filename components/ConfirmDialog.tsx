import React from 'react';
import { DangerIcon, CloseIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/60 backdrop-blur-[2px] z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-bone-light rounded-xl shadow-xl w-full max-w-md border border-mineral overflow-hidden transform transition-all animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start space-x-3.5">
            <div className={`p-2.5 rounded-lg shrink-0 ${isDestructive ? 'bg-danger-subtle text-danger' : 'bg-oxide-subtle text-oxide'}`}>
              <DangerIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-ink leading-snug">
                {title}
              </h3>
              <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-2 text-xs font-semibold text-ink bg-mineral-light hover:bg-mineral rounded-lg transition-colors"
            >
              {cancelLabel || t('cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm ${
                isDestructive
                  ? 'bg-danger hover:bg-danger-hover'
                  : 'bg-coffee hover:bg-coffee-hover'
              }`}
            >
              {confirmLabel || (isDestructive ? t('delete') : t('confirm'))}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
