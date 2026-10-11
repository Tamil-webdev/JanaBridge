import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, ShieldCheck, AlertCircle, Calendar } from 'lucide-react';
import { useSavedItems } from '../../context/SavedItemsContext';
import { useLanguage } from '../../context/LanguageContext';

export const SchemeCard = ({ scheme }) => {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedItems();
  const { t, getLocalized } = useLanguage();

  const saved = isSaved('scheme', scheme.id);
  const displayName = getLocalized(scheme, 'name');
  const displayDesc = getLocalized(scheme, 'description');

  const isCentral = scheme.governmentLevel.toLowerCase() === 'central';

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-[#075BA8]/50 dark:hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              isCentral
                ? 'bg-blue-100 text-blue-800 dark:bg-slate-700 dark:text-blue-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
            }`}>
              {isCentral ? t('common.centralScheme') : t('common.stateScheme')}
            </span>

            {scheme.isMock ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800">
                <AlertCircle className="w-2.5 h-2.5" />
                {t('common.mockDemo')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                {t('common.verified')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave('scheme', scheme);
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

        {/* Scheme Name */}
        <h3
          onClick={() => navigate(`/schemes/${scheme.id}`)}
          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#075BA8] dark:group-hover:text-blue-400 cursor-pointer transition-colors line-clamp-2"
        >
          {displayName}
        </h3>

        {/* Department */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
          {getLocalized(scheme, 'department')}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
          {displayDesc}
        </p>

        {/* Beneficiary chips */}
        <div className="flex flex-wrap gap-1 mt-3">
          {scheme.beneficiaryCategories?.map((cat) => {
            const categoryLabelMap = {
              'students': t('schemes.needStudents', 'Students'),
              'farmers': t('schemes.needFarmers', 'Farmers'),
              'senior-citizens': t('schemes.needSeniors', 'Senior Citizens'),
              'women-children': t('schemes.needWomen', 'Women & Children'),
              'pwd': t('schemes.needPwd', 'Differently Abled'),
              'workers': t('schemes.needWorkers', 'Workers'),
              'small-business': t('schemes.needBusiness', 'Small Business'),
              'all': t('common.all', 'All')
            };
            const label = categoryLabelMap[cat] || cat.replace('-', ' ');
            return (
              <span
                key={cat}
                className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 capitalize"
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {scheme.lastVerifiedAt ? `${t('status')}: ${scheme.lastVerifiedAt}` : t('common.verified')}
        </span>

        <button
          type="button"
          onClick={() => navigate(`/schemes/${scheme.id}`)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#075BA8] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{t('common.viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
