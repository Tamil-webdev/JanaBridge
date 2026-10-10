import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import {
  HelpCircle,
  BookOpen,
  ShieldCheck,
  Eye,
  FileText,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import faqsData from '../data/faqs.json';

export const HelpPage = () => {
  const { t, getLocalized } = useLanguage();
  const [openFaqId, setOpenFaqId] = useState('faq-1');

  const toggleFaq = (id) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader
        title={t('help.title', 'Help & Support Desk')}
        subtitle={t('help.subtitle', 'Frequently asked questions, platform usage guidance, citation interpretation, and privacy policies.')}
        badge={t('home.bannerBadge', 'Citizen Guide')}
      />

      {/* Advisory Banner */}
      <div className="p-4 rounded-3xl bg-blue-50/80 dark:bg-slate-900/80 border border-blue-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#075BA8] dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white block mb-0.5">{t('details.guidanceNotice', 'Statutory Governance Notice:')}</strong>
          {t('statutoryNotice', 'JanaBridge is an informational discovery guide and does not replace statutory government authorities.')}
        </div>
      </div>

      {/* How It Works 3-Step Guide */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#075BA8]" />
          <span>{t('help.howItWorks', 'How to Use JanaBridge Effectively')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <span className="w-7 h-7 rounded-full bg-[#EAF4FF] text-[#075BA8] font-black text-xs flex items-center justify-center mb-2">1</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t('help.step1Title', 'Discover & Match')}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t('help.step1Desc', 'Use global search, filter by citizen category, or select your State to discover applicable central and state welfare programs.')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <span className="w-7 h-7 rounded-full bg-[#EAF4FF] text-[#075BA8] font-black text-xs flex items-center justify-center mb-2">2</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t('help.step2Title', 'Verify Documents')}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t('help.step2Desc', 'Check the required supporting documents checklist to gather required certificates before initiating online filings.')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <span className="w-7 h-7 rounded-full bg-[#EAF4FF] text-[#075BA8] font-black text-xs flex items-center justify-center mb-2">3</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t('help.step3Title', 'Apply on Official Portal')}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t('help.step3Desc', "Follow step-by-step procedures and click direct verified links to the department's authorized portal or nearest e-Sevai kiosk.")}
            </p>
          </div>
        </div>
      </div>

      {/* How to Read Citations */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span>{t('help.citationsTitle', 'Understanding Evidence Citations')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('help.citationsDesc', 'When using JanaBridge Assistant, responses display expandable Citation cards. Each citation highlights the document title, section/page number, exact text snippet, and verification status.')}
        </p>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#075BA8]" />
          <span>{t('help.faqsTitle', 'Frequently Asked Questions (FAQ)')}</span>
        </h2>

        <div className="space-y-2 pt-2">
          {faqsData.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const questionText = getLocalized(faq, 'question');
            const answerText = getLocalized(faq, 'answer');

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/40 flex items-center justify-between gap-3 transition-colors"
                >
                  <span>{questionText}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
                    {answerText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy & Accessibility Guidance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#075BA8]" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('help.accessibilityTitle', 'Accessibility Features')}</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('help.accessibilityDesc', 'Click the Eye icon in the top navigation bar to increase font size (Normal, Large, Extra Large), enable High-Contrast mode, or switch to Dark Theme.')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('help.privacyTitle', 'Privacy & Local Storage')}</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('help.privacyDesc', 'JanaBridge does not transmit your personal search history or bookmarked records to external cloud servers. All saved items and chat threads remain on your local device.')}
          </p>
        </div>
      </div>

      {/* Contact & Hackathon Demonstration Placeholder */}
      <div className="rounded-3xl bg-slate-100 dark:bg-slate-800/80 p-6 border border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t('help.supportPlaceholders', 'Support Desk Demonstration Placeholders')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#075BA8]" />
            <span>support@janabridge.org (Demo)</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#075BA8]" />
            <span>1800-DEMO-BRIDGE</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#075BA8]" />
            <span>Chennai, Tamil Nadu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
