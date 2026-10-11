import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Logo size="default" showTagline />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('home.heroSubtitle', 'An open, multilingual government welfare discovery platform engineered to make public schemes, documents, and eligibility guidance accessible to all citizens.')}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('home.bannerBadge', 'Public Demonstration Architecture')}</span>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
              {t('home.quickServicesTitle', 'Explore Services')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/services" className="hover:text-[#075BA8] dark:hover:text-blue-400 transition-colors">{t('nav.services', 'All Government Services')}</Link></li>
              <li><Link to="/schemes" className="hover:text-[#075BA8] dark:hover:text-blue-400 transition-colors">{t('nav.schemes', 'Welfare Schemes Directory')}</Link></li>
              <li><Link to="/documents" className="hover:text-[#075BA8] dark:hover:text-blue-400 transition-colors">{t('nav.documents', 'Document Guidance Checklist')}</Link></li>
              <li><Link to="/tamil-nadu" className="hover:text-[#075BA8] dark:hover:text-blue-400 transition-colors">{t('nav.tamilNadu', 'Tamil Nadu Focus Portal')}</Link></li>
              <li><Link to="/chat" className="hover:text-[#075BA8] dark:hover:text-blue-400 transition-colors">{t('nav.chat', 'Ask JanaBridge Assistant')}</Link></li>
            </ul>
          </div>

          {/* Helplines & Support Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
              {t('home.helplinesTitle', 'Key Citizen Helplines')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">112:</span>
                <span>National Emergency Response</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">1800-180-1551:</span>
                <span>Kisan Call Centre (Farmers)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">14567:</span>
                <span>Elderline (Senior Citizens)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">1100:</span>
                <span>TN CM Helpline (Mudhalvarin Mugavari)</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Notice Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
              {t('nav.guidelines', 'Compliance & Legal')}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('statutoryNotice', 'JanaBridge is an informational discovery guide and does not replace statutory government authorities.')}
            </p>
            <div className="pt-2 flex flex-col gap-1 text-xs">
              <Link to="/help" className="text-[#075BA8] dark:text-blue-400 hover:underline">
                {t('nav.terms', 'Terms of Service')} & {t('nav.privacy', 'Privacy Statement')}
              </Link>
              <Link to="/help" className="text-[#075BA8] dark:text-blue-400 hover:underline">
                {t('nav.help', 'Help & Contact Desk')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {t('brandName', 'JanaBridge')} — {t('tagline', 'Bridging People to Government Services.')}</p>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-slate-600 dark:hover:text-slate-300">{t('nav.privacy', 'Privacy Policy')}</Link>
            <span>•</span>
            <Link to="/help" className="hover:text-slate-600 dark:hover:text-slate-300">{t('nav.terms', 'Terms of Service')}</Link>
            <span>•</span>
            <Link to="/help" className="hover:text-slate-600 dark:hover:text-slate-300">{t('nav.contact', 'Contact Us')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
