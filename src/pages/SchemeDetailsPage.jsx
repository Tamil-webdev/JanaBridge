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
  Award,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Calendar,
  Share2,
  Printer
} from 'lucide-react';

export const SchemeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedItems();
  const { t, getLocalized, language } = useLanguage();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheme = async () => {
      setLoading(true);
      const data = await mockApi.getSchemeById(id);
      setScheme(data);
      setLoading(false);
    };
    fetchScheme();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#075BA8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">{t('common.loading', 'Loading scheme guidelines...')}</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">{t('schemes.noResults', 'Scheme Not Found')}</h2>
        <p className="text-sm text-slate-500">{t('schemes.noResultsDesc', 'The requested welfare scheme record could not be found.')}</p>
        <button
          onClick={() => navigate('/schemes')}
          className="px-4 py-2 bg-[#075BA8] text-white rounded-xl text-xs font-semibold"
        >
          {t('common.back', 'Return to Schemes Directory')}
        </button>
      </div>
    );
  }

  const saved = isSaved('scheme', scheme.id);
  const displayName = getLocalized(scheme, 'name');
  const displayOverview = getLocalized(scheme, 'overview') || getLocalized(scheme, 'description');
  const displayBenefits = getLocalized(scheme, 'benefits') || scheme.benefits || [];
  const displayEligibility = getLocalized(scheme, 'eligibility') || scheme.eligibility || [];
  const displayDocs = getLocalized(scheme, 'requiredDocuments') || scheme.requiredDocuments || [];
  const displaySteps = getLocalized(scheme, 'applicationSteps') || scheme.applicationSteps || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Bar Navigation & Actions */}
      <div className="flex items-center justify-between no-print">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#075BA8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back', 'Back to Schemes')}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
            title={t('common.print', 'Print scheme guidelines')}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('common.print', 'Print Scheme')}</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                scheme.governmentLevel?.toLowerCase() === 'central'
                  ? 'bg-blue-100 text-blue-800 dark:bg-slate-700 dark:text-blue-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
              }`}>
                {scheme.governmentLevel?.toLowerCase() === 'central' ? t('common.centralScheme', 'Central Scheme') : t('common.stateScheme', 'State Scheme')}
              </span>

              {scheme.isMock ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50">
                  <AlertCircle className="w-3 h-3" />
                  {t('common.mockDemo', 'Demonstration Mock Entry')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {t('common.verified', scheme.verificationStatus || 'Verified')}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight break-words">
              {displayName}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-1">
              <Building2 className="w-4 h-4 text-[#075BA8] shrink-0" />
              <span className="break-words">{getLocalized(scheme, 'department')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleSave('scheme', scheme)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                saved
                  ? 'bg-[#EAF4FF] border-[#075BA8] text-[#075BA8] dark:bg-slate-700 dark:border-blue-500 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#075BA8]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
              <span>{saved ? t('common.saved', 'Saved') : t('common.save', 'Save')}</span>
            </button>

            {scheme.officialSourceUrl && (
              <a
                href={scheme.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075BA8] text-white hover:bg-[#064780] text-xs font-semibold shadow-xs"
              >
                <span>{t('common.officialSource', 'Official Source')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* 1. Overview */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">{t('details.overview', 'Overview:')}</p>
          <p>{displayOverview}</p>
        </div>

        {/* Last Verified date */}
        {scheme.lastVerifiedAt && (
          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('details.lastVerified', 'Guidelines Last Verified:')} <strong>{scheme.lastVerifiedAt}</strong></span>
          </div>
        )}
      </div>

      {/* 2. Benefits */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-[#075BA8] dark:text-blue-400" />
          <span>{t('details.benefits', 'Key Entitlements & Financial Benefits')}</span>
        </h2>

        <div className="space-y-2.5 pt-1">
          {displayBenefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Eligibility Requirements */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{t('details.eligibility', 'Eligibility Requirements')}</span>
        </h2>

        <ul className="space-y-2.5 pt-1 pl-1">
          {displayEligibility.map((item, idx) => (
            <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Required Supporting Documents */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span>{t('details.requiredDocs', 'Required Supporting Documents')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {displayDocs.map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200"
            >
              <CheckCircle className="w-4 h-4 text-[#075BA8] dark:text-blue-400 shrink-0 mt-0.5" />
              <span className="font-medium">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Application Steps */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#075BA8]" />
          <span>{t('details.procedureWorkflow', 'Application Procedure & Workflow')}</span>
        </h2>

        <div className="space-y-3 pt-1">
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

      {/* Assistant Link CTA */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#075BA8] to-[#064780] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold">{t('details.chatCTA', 'Have specific questions about this scheme?')}</h4>
          <p className="text-xs text-blue-100">{t('details.chatCTASub', 'Ask JanaBridge Assistant for instant eligibility cross-referencing and citations.')}</p>
        </div>
        <Link
          to={`/chat?q=${encodeURIComponent(`Tell me about ${scheme.name}`)}`}
          className="px-4 py-2 rounded-xl bg-white text-[#075BA8] text-xs font-bold hover:bg-blue-50 shrink-0"
        >
          {t('details.chatCTABtn', 'Ask JanaBridge AI')}
        </Link>
      </div>
    </div>
  );
};
