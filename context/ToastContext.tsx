import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircleIcon, DangerIcon, InfoIcon, CloseIcon } from '../components/icons';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3500) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { id, type, message, duration };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg: string, duration?: number) => showToast(msg, 'success', duration), [showToast]);
  const error = useCallback((msg: string, duration?: number) => showToast(msg, 'error', duration), [showToast]);
  const info = useCallback((msg: string, duration?: number) => showToast(msg, 'info', duration), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast Container Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          const typeStyles = {
            success: 'bg-slate-900/95 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40',
            error: 'bg-slate-900/95 border-red-500/50 text-red-300 shadow-red-950/40',
            info: 'bg-slate-900/95 border-indigo-500/50 text-indigo-300 shadow-indigo-950/40',
          }[toast.type];

          const IconComponent = {
            success: <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />,
            error: <DangerIcon className="h-5 w-5 text-red-400 shrink-0" />,
            info: <InfoIcon className="h-5 w-5 text-indigo-400 shrink-0" />,
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in ${typeStyles}`}
            >
              {IconComponent}
              <div className="flex-1 text-sm font-medium text-slate-200 break-words leading-snug">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded"
                aria-label="Close"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
