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
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          const typeStyles = {
            success: 'bg-ink text-bone border-olive/50 shadow-md',
            error: 'bg-ink text-bone border-danger/50 shadow-md',
            info: 'bg-ink text-bone border-mineral/40 shadow-md',
          }[toast.type];

          const IconComponent = {
            success: <CheckCircleIcon className="h-4 w-4 text-olive-subtle shrink-0 mt-0.5" />,
            error: <DangerIcon className="h-4 w-4 text-danger-subtle shrink-0 mt-0.5" />,
            info: <InfoIcon className="h-4 w-4 text-mineral-light shrink-0 mt-0.5" />,
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start space-x-2.5 p-3.5 rounded-xl border shadow-lg transition-all duration-200 animate-slide-up ${typeStyles}`}
            >
              {IconComponent}
              <div className="flex-1 text-xs font-medium text-bone-light break-words leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-mineral-dark hover:text-bone transition-colors p-0.5 rounded"
                aria-label="Close"
              >
                <CloseIcon className="h-3.5 w-3.5" />
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
