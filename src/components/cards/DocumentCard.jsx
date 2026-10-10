import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, FileText, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useSavedItems } from '../../context/SavedItemsContext';
import { useLanguage } from '../../context/LanguageContext';

export const DocumentCard = ({ document }) => {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedItems();
  const { t, getLocalized } = useLanguage();

  const saved = isSaved('document', document.id);
  const displayName = getLocalized(document, 'name');
  const displayPurpose = getLocalized(document, 'purpose');

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-[#075BA8]/50 dark:hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {getLocalized(document, 'category')}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSave('document', document);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                saved
                  ? 'text-[#075BA8] bg-[#EAF4FF] dark:text-blue-400 dark:bg-slate-700'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={saved ? t('common.remove') : t('common.save')}
              aria-label={saved ? t('common.remove') : t('common.save')}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <h3
          onClick={() => navigate(`/documents/${document.id}`)}
          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#075BA8] dark:group-hover:text-blue-400 cursor-pointer transition-colors line-clamp-1"
        >
          {displayName}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
          {getLocalized(document, 'issuingAuthority')}
        </p>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
          {displayPurpose}
        </p>

        {/* Highlighted Common Use Case */}
        {(getLocalized(document, 'commonUseCases')?.[0] || document.commonUseCases?.[0]) && (
          <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{getLocalized(document, 'commonUseCases')?.[0] || document.commonUseCases[0]}</span>
          </div>
        )}
      </div>

      <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          {t('common.verified')}
        </span>

        <button
          type="button"
          onClick={() => navigate(`/documents/${document.id}`)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#075BA8] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{t('common.viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
