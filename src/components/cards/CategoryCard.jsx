import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheat, UserCheck, GraduationCap, HeartHandshake, Accessibility, HardHat, Store, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const categoryIconMap = {
  'farmers': Wheat,
  'senior-citizens': UserCheck,
  'students': GraduationCap,
  'women-children': HeartHandshake,
  'pwd': Accessibility,
  'workers': HardHat,
  'small-business': Store,
  'all': Users
};

const categoryColorMap = {
  'farmers': 'from-emerald-500 to-green-600',
  'senior-citizens': 'from-amber-500 to-orange-600',
  'students': 'from-blue-500 to-indigo-600',
  'women-children': 'from-pink-500 to-rose-600',
  'pwd': 'from-teal-500 to-cyan-600',
  'workers': 'from-orange-500 to-amber-600',
  'small-business': 'from-purple-500 to-violet-600',
  'all': 'from-blue-600 to-[#075BA8]'
};

export const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { t, getLocalized } = useLanguage();

  const IconComponent = categoryIconMap[category.id] || Users;
  const gradientColor = categoryColorMap[category.id] || 'from-blue-500 to-[#075BA8]';

  const displayName = getLocalized(category, 'name');
  const displayTagline = getLocalized(category, 'tagline');

  return (
    <div
      onClick={() => navigate(`/schemes?category=${category.id}`)}
      className="group relative cursor-pointer bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-lg hover:-translate-y-0.5 hover:border-[#075BA8]/60 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientColor} text-white flex items-center justify-center shadow-md mb-3.5 group-hover:scale-105 transition-transform`}>
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#075BA8] dark:group-hover:text-blue-400 transition-colors">
          {displayName}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          {displayTagline}
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-[#075BA8] dark:text-blue-400">
        <span>{t('common.viewAllSchemes')}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
