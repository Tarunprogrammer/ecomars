import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast({ toasts, removeToast }) {
  if (!toasts || !toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          {t.type === 'error' ? (
            <AlertCircle size={18} style={{ color: '#f87171' }} />
          ) : t.type === 'info' ? (
            <Info size={18} style={{ color: '#60a5fa' }} />
          ) : (
            <CheckCircle size={18} style={{ color: '#34d399' }} />
          )}
          <span>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{ color: '#9ca3af', marginLeft: 'auto' }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
