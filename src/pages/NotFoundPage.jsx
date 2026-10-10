import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="py-20 flex flex-col items-center text-center max-w-md mx-auto space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-[#EAF4FF] text-[#075BA8] flex items-center justify-center shadow-xs">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-black text-slate-900 dark:text-white">404</h1>
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('notFound.title', 'Page Not Found')}</h2>
      <p className="text-xs text-slate-500 leading-relaxed">
        {t('notFound.desc', 'The government service or page you are attempting to access does not exist or has been relocated.')}
      </p>

      <div className="pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('common.back', 'Go Back')}</span>
        </button>

        <Link
          to="/"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075BA8] text-white text-xs font-semibold hover:bg-[#064780]"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{t('nav.home', 'Return Home')}</span>
        </Link>
      </div>
    </div>
  );
};
