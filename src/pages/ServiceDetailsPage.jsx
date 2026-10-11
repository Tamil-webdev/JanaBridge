import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { useSavedItems } from '../context/SavedItemsContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileText,
  CheckCircle,
  Clock,
  Layers,
  AlertCircle
} from 'lucide-react';

export const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedItems();
  const { t, getLocalized, language } = useLanguage();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      const data = await mockApi.getServiceById(id);
      setService(data);
      setLoading(false);
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#075BA8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">{t('common.loading', 'Loading service details...')}</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">{t('services.noResults', 'Service Not Found')}</h2>
        <p className="text-sm text-slate-500">{t('services.noResultsDesc', 'The requested government service could not be located.')}</p>
        <button
          onClick={() => navigate('/services')}
          className="px-4 py-2 bg-[#075BA8] text-white rounded-xl text-xs font-semibold"
        >
          {t('common.back', 'Return to Services')}
        </button>
      </div>
    );
  }

  const saved = isSaved('service', service.id);
  const displayName = getLocalized(service, 'name');
  const displayDescription = getLocalized(service, 'description');
  const displayDocs = getLocalized(service, 'requiredDocuments') || service.requiredDocuments || [];
  const displaySteps = getLocalized(service, 'applicationSteps') || service.applicationSteps || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#075BA8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back', 'Back to Services')}</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-700 dark:text-blue-300 capitalize">
                {service.category.replace('-', ' ')}
              </span>

              {service.isMock ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  <AlertCircle className="w-3 h-3" />
                  {t('common.mockDemo', 'Demonstration Mock Service')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {t('common.verified', service.verificationStatus || 'Verified')}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight break-words">
              {displayName}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-1">
              <Building2 className="w-4 h-4 text-[#075BA8] shrink-0" />
              <span className="break-words">{getLocalized(service, 'department')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleSave('service', service)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                saved
                  ? 'bg-[#EAF4FF] border-[#075BA8] text-[#075BA8] dark:bg-slate-700 dark:border-blue-500 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#075BA8]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
              <span>{saved ? t('common.saved', 'Saved') : t('common.save', 'Save')}</span>
            </button>

            {service.officialSourceUrl && (
              <a
                href={service.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075BA8] text-white hover:bg-[#064780] text-xs font-semibold shadow-xs"
              >
                <span>{t('common.visitPortal', 'Visit Official Portal')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Overview paragraph */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {displayDescription}
        </div>
      </div>

      {/* Required Supporting Documents Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span>{t('details.requiredDocs', 'Required Supporting Documents')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('details.requiredDocsSubtitle', 'Have scanned copies of the following documents ready before commencing your online submission:')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {displayDocs.map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step by step procedure */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#075BA8]" />
          <span>{t('details.procedure', 'Step-by-Step Application Procedure')}</span>
        </h2>

        <div className="space-y-3 pt-2">
          {displaySteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-full bg-[#EAF4FF] dark:bg-slate-700 text-[#075BA8] dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-xs">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Disclaimer Note */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-900/80 border border-blue-200/60 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[#075BA8] shrink-0 mt-0.5" />
        <span>
          <strong>{t('details.guidanceNotice', 'Important Guidance Notice:')}</strong> {t('details.guidanceNoticeText', "JanaBridge is an informational navigation guide. Always verify fee details and deadlines directly against the department's official portal.")}
        </span>
      </div>
    </div>
  );
};
