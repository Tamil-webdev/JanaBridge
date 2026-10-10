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
  Award,
  AlertCircle
} from 'lucide-react';

export const DocumentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedItems();
  const { t, getLocalized, language } = useLanguage();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      const data = await mockApi.getDocumentById(id);
      setDoc(data);
      setLoading(false);
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#075BA8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">{t('common.loading', 'Loading document guidance...')}</p>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">{t('documents.noResults', 'Document Guide Not Found')}</h2>
        <p className="text-sm text-slate-500">{t('documents.noResultsDesc', 'The requested document record could not be found.')}</p>
        <button
          onClick={() => navigate('/documents')}
          className="px-4 py-2 bg-[#075BA8] text-white rounded-xl text-xs font-semibold"
        >
          {t('common.back', 'Return to Document Guide')}
        </button>
      </div>
    );
  }

  const saved = isSaved('document', doc.id);
  const displayName = getLocalized(doc, 'name');
  const displayPurpose = getLocalized(doc, 'purpose');
  const displayValidity = getLocalized(doc, 'validity');
  const displayUseCases = getLocalized(doc, 'commonUseCases') || doc.commonUseCases || [];
  const displayReqDocs = getLocalized(doc, 'commonlyRequestedSupportingDocuments') || doc.commonlyRequestedSupportingDocuments || [];
  const displaySteps = getLocalized(doc, 'applicationSteps') || doc.applicationSteps || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#075BA8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back', 'Back to Document Guide')}</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                {getLocalized(doc, 'category')}
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {t('common.verified', doc.verificationStatus || 'Verified')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight break-words">
              {displayName}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-1">
              <Building2 className="w-4 h-4 text-[#075BA8] shrink-0" />
              <span className="break-words">{t('details.issuingAuthority', 'Issuing Authority:')} <strong>{getLocalized(doc, 'issuingAuthority')}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleSave('document', doc)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                saved
                  ? 'bg-[#EAF4FF] border-[#075BA8] text-[#075BA8] dark:bg-slate-700 dark:border-blue-500 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#075BA8]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
              <span>{saved ? t('common.saved', 'Saved') : t('common.save', 'Save')}</span>
            </button>

            {doc.officialSourceUrl && (
              <a
                href={doc.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075BA8] text-white hover:bg-[#064780] text-xs font-semibold shadow-xs"
              >
                <span>{t('common.applyNow', 'Official Portal')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Purpose */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">{t('details.purpose', 'Document Purpose:')}</p>
          <p>{displayPurpose}</p>
        </div>

        {/* Validity */}
        {displayValidity && (
          <div className="pt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('details.validity', 'Document Validity:')} <strong>{displayValidity}</strong></span>
          </div>
        )}
      </div>

      {/* Common Use Cases */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{t('details.useCases', 'Common Use Cases & Situations')}</span>
        </h2>

        <div className="space-y-2 pt-1">
          {displayUseCases.map((useCase, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#075BA8] mt-1.5 shrink-0" />
              <span className="leading-relaxed">{useCase}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Commonly Requested Supporting Documents */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span>{t('details.requiredDocs', 'Required Supporting Documents')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {displayReqDocs.map((req, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200"
            >
              <span className="text-[10px] font-bold text-[#075BA8]">✓</span>
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Application Steps */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#075BA8]" />
          <span>{t('details.howToObtain', 'How to Obtain / Apply for This Document')}</span>
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
    </div>
  );
};
