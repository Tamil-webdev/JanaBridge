import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Eye, Sun, Moon } from 'lucide-react';

export const AccessibilityModal = ({ isOpen, onClose }) => {
  const { theme, toggleTheme, fontSize, setFontSize, highContrast, toggleHighContrast } = useTheme();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF4FF] dark:bg-slate-700 flex items-center justify-center text-[#075BA8] dark:text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
            <h2 id="accessibility-title" className="text-base font-bold text-slate-800 dark:text-white">
              {t('modal.accessibilityTitle')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Text Size Controls */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {t('modal.textSize')}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'normal', label: 'A', sub: t('modal.normal'), scale: 'text-sm' },
                { id: 'large', label: 'A+', sub: t('modal.large'), scale: 'text-base font-medium' },
                { id: 'xlarge', label: 'A++', sub: t('modal.xlarge'), scale: 'text-lg font-bold' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFontSize(opt.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    fontSize === opt.id
                      ? 'border-[#075BA8] bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-800 dark:border-blue-500 dark:text-blue-400 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className={opt.scale}>{opt.label}</span>
                  <span className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('modal.highContrast')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('modal.highContrastDesc')}</p>
            </div>
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                highContrast ? 'bg-[#075BA8]' : 'bg-slate-200 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={highContrast}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Theme Mode */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('modal.displayTheme')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('modal.displayThemeDesc')}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                  theme === 'light'
                    ? 'bg-white text-[#075BA8] shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{t('modal.light')}</span>
              </button>
              <button
                type="button"
                onClick={() => theme === 'light' && toggleTheme()}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{t('modal.dark')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#075BA8] text-white hover:bg-[#064780] transition-colors"
          >
            {t('modal.applyClose')}
          </button>
        </div>
      </div>
    </div>
  );
};
