import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ArrowRight, Layers, FileCheck, HeartPulse, GraduationCap, Sprout, ShieldCheck, Building2, Car, Zap, Scale } from 'lucide-react';
import { useSavedItems } from '../../context/SavedItemsContext';
import { useLanguage } from '../../context/LanguageContext';

const iconMap = {
  'identity-certificates': FileCheck,
  'health-wellness': HeartPulse,
  'education-employment': GraduationCap,
  'agriculture': Sprout,
  'pension-social': ShieldCheck,
  'edistrict-revenue': Building2,
  'transport-travel': Car,
  'utilities-bills': Zap,
  'police-legal': Scale,
};

export const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedItems();
  const { t, getLocalized } = useLanguage();

  const saved = isSaved('service', service.id);
  const IconComponent = iconMap[service.category] || Layers;

  const displayName = getLocalized(service, 'name');
  const displayDesc = getLocalized(service, 'description');

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-[#075BA8]/50 dark:hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between">
      {/* Top row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-[#EAF4FF] dark:bg-slate-700 text-[#075BA8] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
              {(() => {
                const catMap = {
                  'identity-certificates': t('cat.identity', 'Identity & Certificates'),
                  'health-wellness': t('cat.health', 'Health & Wellness'),
                  'education-employment': t('cat.education', 'Education & Employment'),
                  'agriculture': t('cat.agriculture', 'Agriculture & Farming'),
                  'pension-social': t('cat.pension', 'Pension & Welfare'),
                  'edistrict-revenue': t('cat.revenue', 'Revenue & Certificates'),
                  'transport-travel': t('cat.travel', 'Transport & Travel'),
                  'utilities-bills': t('cat.utilities', 'Utility & Bills'),
                  'police-legal': t('cat.identity', 'Police & Legal')
                };
                return catMap[service.category] || service.category.replace('-', ' ');
              })()}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSave('service', service);
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

        {/* Title */}
        <h3
          onClick={() => navigate(`/services/${service.id}`)}
          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#075BA8] dark:group-hover:text-blue-400 cursor-pointer transition-colors line-clamp-2"
        >
          {displayName}
        </h3>

        {/* Department */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
          {getLocalized(service, 'department')}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {service.isMock ? t('common.mockDemo') : t('common.verified')}
        </span>

        <button
          type="button"
          onClick={() => navigate(`/services/${service.id}`)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#075BA8] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{t('common.explore')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
