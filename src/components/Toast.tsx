import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  text: string;
}

interface Props {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<Props> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl animate-fade-in">
      {toast.type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      )}
      <span className="text-sm font-medium">{toast.text}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};