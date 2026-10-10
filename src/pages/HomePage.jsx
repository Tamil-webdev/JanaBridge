import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { SearchBar } from '../components/common/SearchBar';
import { StateSelector } from '../components/common/StateSelector';
import { ServiceCard } from '../components/cards/ServiceCard';
import { SchemeCard } from '../components/cards/SchemeCard';
import { DocumentCard } from '../components/cards/DocumentCard';
import { CategoryCard } from '../components/cards/CategoryCard';
import { mockApi } from '../services/mockApi';
import { useStateContext } from '../context/StateContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  FileCheck,
  HeartPulse,
  GraduationCap,
  Sprout,
  ShieldAlert,
  Car,
  Zap,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export const HomePage = () => {
  const { onOpenVoiceModal } = useOutletContext();
  const { selectedState, currentStateObj } = useStateContext();
  const { t, getLocalized } = useLanguage();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [services, setServices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState({ serviceCategories: [], citizenCategories: [] });
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      const [sch, srv, docs, cats, helps] = await Promise.all([
        mockApi.getSchemes({ state: selectedState }),
        mockApi.getServices({ state: selectedState }),
        mockApi.getDocuments(),
        mockApi.getCategories(),
        mockApi.getHelplines()
      ]);
      setSchemes(sch);
      setServices(srv);
      setDocuments(docs);
      setCategories(cats);
      setHelplines(helps);
      setLoading(false);
    };

    loadHomeData();
  }, [selectedState]);

  const quickSearchSuggestions = [
    { text: t("home.sugScholarship", "Find scholarships for students"), query: "scholarship" },
    { text: t("home.sugSenior", "Explore benefits for senior citizens"), query: "senior citizen" },
    { text: t("home.sugIncome", "Learn how to apply for an income certificate"), query: "income certificate" },
    { text: t("home.sugFarmer", "Find services for farmers"), query: "farmer" },
    { text: t("home.sugLand", "Understand land record documents"), query: "land records" },
  ];

  const quickCategories = [
    { id: 'health-wellness', name: t('cat.health', 'Health'), icon: HeartPulse, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
    { id: 'education-employment', name: t('cat.education', 'Education'), icon: GraduationCap, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' },
    { id: 'agriculture', name: t('cat.agriculture', 'Agriculture'), icon: Sprout, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
    { id: 'pension-social', name: t('cat.pension', 'Pension'), icon: ShieldCheck, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { id: 'education-employment', name: t('cat.employment', 'Employment'), icon: GraduationCap, color: 'text-blue-600 bg-blue-50 dark:bg-slate-800' },
    { id: 'transport-travel', name: t('cat.travel', 'Travel'), icon: Car, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40' },
    { id: 'utilities-bills', name: t('cat.utilities', 'Utilities'), icon: Zap, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40' },
    { id: 'identity-certificates', name: t('cat.identity', 'Identity Documents'), icon: FileCheck, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* ================= A. WELCOME HERO SECTION ================= */}
      <section className="relative rounded-3xl bg-gradient-to-b from-[#EAF4FF] via-white to-transparent dark:from-slate-900 dark:via-slate-900/60 dark:to-transparent p-6 sm:p-10 lg:p-14 border border-blue-100/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-200/30 dark:bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5">
          {/* Top State Badge & Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {t('home.region', 'Region:')} <strong className="text-[#075BA8] dark:text-blue-400">{getLocalized(currentStateObj, 'name')}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <StateSelector compact />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('home.welcomePrefix', 'Welcome to')} <span className="text-[#075BA8] dark:text-blue-400">{t('brandName', 'JanaBridge')}</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('home.heroSubtitle', 'Discover government schemes, access essential services and understand the documents you need—all in one place.')}
          </p>

          {/* Prominent Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <SearchBar variant="hero" onVoiceClick={onOpenVoiceModal} autoFocus={false} />
          </div>

          {/* Popular Search Chips */}
          <div className="pt-2 text-left sm:text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 block sm:inline mb-1.5 sm:mb-0">
              {t('home.popularSearches', 'Popular Searches:')}
            </span>
            <div className="inline-flex flex-wrap gap-1.5">
              {quickSearchSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => navigate(`/services?q=${encodeURIComponent(item.query)}`)}
                  className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 hover:bg-[#EAF4FF] hover:text-[#075BA8] dark:hover:bg-blue-900/40 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors shadow-2xs font-medium"
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Mock Notice */}
          <div className="pt-2">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{t('demoNotice')}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ================= B. PROMOTIONAL HERO BANNER (UMANG STYLE) ================= */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#075BA8] to-[#064780] text-white p-6 sm:p-8 shadow-lg overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold tracking-wide backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('home.bannerBadge', 'Public Service Discovery Initiative')}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {t('home.bannerTitle', 'Government Services, Made Simpler')}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              {t('home.bannerSubtitle', 'Find relevant schemes, understand eligibility and discover the documents you may need. Built for students, farmers, senior citizens, and first-time digital users.')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/schemes')}
              className="px-5 py-2.5 rounded-xl bg-white text-[#075BA8] hover:bg-blue-50 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98"
            >
              {t('home.bannerBtnSchemes', 'Explore Welfare Schemes')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/chat')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm transition-all"
            >
              {t('home.bannerBtnChat', 'Ask JanaBridge AI')}
            </button>
          </div>
        </div>

        {/* Decorative background geometry */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      </section>

      {/* ================= C. QUICK SERVICES ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('quickServicesTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('home.quickServicesSubtitle', 'Access most frequently requested citizen departments')}
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs sm:text-sm font-bold text-[#075BA8] dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{t('viewAllServices')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(`/services?category=${item.id}`)}
                className="group p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-[#075BA8] hover:shadow-md transition-all flex flex-col items-center text-center justify-center gap-2"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#075BA8] dark:group-hover:text-blue-400 line-clamp-1">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= D. LATEST SCHEMES & UPDATES ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {t('latestSchemesTitle')}
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {t('home.activeIn', 'Active in')} {getLocalized(currentStateObj, 'name')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('home.latestSchemesSubtitle', 'Verified statutory guidelines and welfare eligibility requirements')}
            </p>
          </div>
          <Link
            to="/schemes"
            className="text-xs sm:text-sm font-bold text-[#075BA8] dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{t('viewAllSchemes')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.slice(0, 6).map((sch) => (
            <SchemeCard key={sch.id} scheme={sch} />
          ))}
        </div>
      </section>

      {/* ================= E. POPULAR GOVERNMENT SERVICES ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('popularServicesTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('home.popularServicesSubtitle', 'Direct access to vital identity, revenue, and e-District services')}
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs sm:text-sm font-bold text-[#075BA8] dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{t('viewAllServices')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.slice(0, 6).map((srv) => (
            <ServiceCard key={srv.id} service={srv} />
          ))}
        </div>
      </section>

      {/* ================= F. DOCUMENTS YOU MIGHT NEED ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('documentsYouNeedTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('home.documentsYouNeedSubtitle', 'Learn which supporting certificates and records are needed for public applications')}
            </p>
          </div>
          <Link
            to="/documents"
            className="text-xs sm:text-sm font-bold text-[#075BA8] dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{t('common.viewAllDocuments', 'View All Documents')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.slice(0, 8).map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </section>

      {/* ================= G. EXPLORE BY CITIZEN CATEGORY ================= */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('citizenCategoriesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('home.citizenCategoriesSubtitle', 'Personalized portals categorized by occupation and demographic needs')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.citizenCategories?.filter(c => c.id !== 'all').map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* ================= I. ESSENTIAL PUBLIC HELPLINES ================= */}
      <section className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('helplinesTitle')}
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              {t('home.helplinesBadge', 'Verified Public Numbers')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('home.helplinesSubtitle', '24x7 toll-free public safety, agricultural advisory, and grievance support lines')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {helplines.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {getLocalized(item, 'category')}
                </span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                  {getLocalized(item, 'name')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {t('details.hours', 'Hours')}: {getLocalized(item, 'available')}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                  className="text-sm font-extrabold text-[#075BA8] dark:text-blue-400 hover:underline flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{item.number}</span>
                </a>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  item.isMock ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {item.isMock ? t('common.mockDemo', 'Demo data') : t('common.verified', 'Verified')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
