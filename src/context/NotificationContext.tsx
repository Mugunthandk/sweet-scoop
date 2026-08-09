import React, { createContext, useContext, useState } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface NotificationContextType {
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (title: string, message?: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: Toast = { id, type, title, message };
    setToasts(prev => [newToast, ...prev]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Overlay UI */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-start gap-3 border transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-[#fcfae4] border-[#81c784] text-[#2e7d32]'
                : toast.type === 'error'
                ? 'bg-[#fff0f2] border-[#e57373] text-[#c62828]'
                : 'bg-[#f4f3e6] border-[#f48fb1] text-[#964261]'
            }`}
          >
            <span className="text-xl">
              {toast.type === 'success' ? '🍦' : toast.type === 'error' ? '⚠️' : '✨'}
            </span>
            <div className="flex-1">
              <h4 className="font-bold text-sm leading-tight">{toast.title}</h4>
              {toast.message && <p className="text-xs mt-0.5 opacity-90">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-xs opacity-50 hover:opacity-100 p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
