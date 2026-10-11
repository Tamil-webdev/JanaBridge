import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { SchemeCard } from '../components/cards/SchemeCard';
import { EmptyState } from '../components/common/EmptyState';
import { StateSelector } from '../components/common/StateSelector';
import { mockApi } from '../services/mockApi';
import { useStateContext } from '../context/StateContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Filter,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  X,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const SchemesPage = () => {
  const { selectedState, currentStateObj } = useStateContext();
  const { t, getLocalized } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [levelFilter, setLevelFilter] = useState('all'); // all, central, state
  const [sortBy, setSortBy] = useState('relevance'); // relevance, date
  const [schemes, setSchemes] = useState([]);
  const [citizenCategories, setCitizenCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // "Find schemes for my needs" interactive wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState([]);

  const needsOptions = [
    { id: 'students', label: t('schemes.needStudents', 'Student / Pursuing Higher Education') },
    { id: 'farmers', label: t('schemes.needFarmers', 'Farmer / Agricultural Landholder') },
    { id: 'senior-citizens', label: t('schemes.needSeniors', 'Senior Citizen (60+ Years)') },
    { id: 'women-children', label: t('schemes.needWomen', 'Woman Head of Household') },
    { id: 'pwd', label: t('schemes.needPwd', 'Person with a Disability (Differently Abled)') },
    { id: 'workers', label: t('schemes.needWorkers', 'Daily Wage Worker / Unorganized Labour') },
    { id: 'small-business', label: t('schemes.needBusiness', 'Street Vendor / Micro Business Owner') },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await mockApi.getCategories();
      setCitizenCategories(data.citizenCategories || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      let data = await mockApi.getSchemes({
        state: selectedState,
        category: selectedCategory,
        level: levelFilter,
        query: query
      });

      // Filter by interactive wizard needs if active
      if (selectedNeeds.length > 0) {
        data = data.filter(s =>
          s.beneficiaryCategories.some(cat => selectedNeeds.includes(cat)) ||
          s.beneficiaryCategories.includes('all')
        );
      }

      // Sort
      if (sortBy === 'date') {
        data.sort((a, b) => new Date(b.lastVerifiedAt || '2024-01-01') - new Date(a.lastVerifiedAt || '2024-01-01'));
      }

      setSchemes(data);
      setLoading(false);
    };

    fetchSchemes();
  }, [selectedState, selectedCategory, levelFilter, query, selectedNeeds, sortBy]);

  const toggleNeed = (needId) => {
    setSelectedNeeds(prev =>
      prev.includes(needId) ? prev.filter(id => id !== needId) : [...prev, needId]
    );
  };

  const handleClearAll = () => {
    setQuery('');
    setSelectedCategory('all');
    setLevelFilter('all');
    setSelectedNeeds([]);
    setSortBy('relevance');
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('schemes.title', 'Government Welfare Schemes')}
        subtitle={t('schemes.subtitle', 'Discover central and state government welfare schemes tailored to your occupation and demographic background.')}
        badge={`${t('home.region', 'Region:')} ${getLocalized(currentStateObj, 'name')}`}
        actions={
          <button
            type="button"
            onClick={() => setWizardOpen(!wizardOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#075BA8] to-[#064780] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>{t('schemes.wizardBtn', 'Find Schemes for My Needs')}</span>
          </button>
        }
      />

      {/* ================= Interactive 'Find Schemes for My Needs' Drawer / Panel ================= */}
      {wizardOpen && (
        <div className="rounded-3xl bg-gradient-to-br from-[#EAF4FF] to-white dark:from-slate-900 dark:to-slate-800 border-2 border-[#075BA8]/30 dark:border-blue-500/30 p-6 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#075BA8] dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('schemes.wizardTitle', 'Find Schemes for My Circumstances')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {t('schemes.wizardSubtitle', 'Select one or more profiles that match your situation to filter demonstration schemes:')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWizardOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {needsOptions.map((opt) => {
              const selected = selectedNeeds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleNeed(opt.id)}
                  className={`p-3 rounded-xl border text-xs text-left font-medium flex items-center justify-between transition-all ${
                    selected
                      ? 'bg-[#075BA8] border-[#075BA8] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#075BA8]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selected && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {t('schemes.wizardDisclaimer', '* Demonstration matches represent example guidelines, not final statutory eligibility sanctions.')}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {selectedNeeds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedNeeds([])}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold"
                >
                  {t('common.clearAll', 'Clear Selection')}
                </button>
              )}
              <button
                type="button"
                onClick={() => setWizardOpen(false)}
                className="px-4 py-1.5 bg-[#075BA8] text-white rounded-lg font-bold"
              >
                {t('schemes.wizardApply', { count: schemes.length })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Filters Container ================= */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('schemes.searchPlaceholder', 'Search schemes by keyword, benefit, or department...')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#075BA8]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Central / State Level Dropdown */}
          <div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#075BA8] cursor-pointer"
            >
              <option value="all">{t('schemes.allLevels', 'All Government Levels')}</option>
              <option value="central">{t('schemes.centralLevel', 'Central Sector Schemes')}</option>
              <option value="state">{t('schemes.stateLevel', 'State Government Schemes')}</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#075BA8] cursor-pointer"
            >
              <option value="relevance">{t('schemes.sortRelevance', 'Sort by Relevance')}</option>
              <option value="date">{t('schemes.sortDate', 'Sort by Last Verified Date')}</option>
            </select>
          </div>
        </div>

        {/* Beneficiary Category Filter Chips */}
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
            {t('schemes.filterCategory', 'Filter by Beneficiary Category:')}
          </span>
          <div className="flex flex-wrap gap-2">
            {citizenCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSearchParams(cat.id === 'all' ? {} : { category: cat.id });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#075BA8] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {getLocalized(cat, 'name')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>{t('common.showing', 'Showing')} {schemes.length} {t('common.results', 'schemes')}</span>
        {(query || selectedCategory !== 'all' || levelFilter !== 'all' || selectedNeeds.length > 0) && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[#075BA8] dark:text-blue-400 font-semibold hover:underline"
          >
            {t('common.resetFilters', 'Reset All Filters')}
          </button>
        )}
      </div>

      {/* Schemes Grid */}
      {schemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('schemes.noResults', 'No matching schemes found')}
          message={t('schemes.noResultsDesc', 'No government schemes match the selected category or criteria. Try clearing filters or exploring general schemes.')}
          actionText={t('common.resetFilters', 'Reset All Filters')}
          onAction={handleClearAll}
        />
      )}
    </div>
  );
};
