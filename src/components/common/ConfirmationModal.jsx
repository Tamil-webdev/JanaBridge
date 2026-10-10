import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = true,
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDanger ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' : 'bg-[#EAF4FF] text-[#075BA8]'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-xs ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#075BA8] hover:bg-[#064780]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
