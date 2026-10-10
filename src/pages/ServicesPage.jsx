import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { ServiceCard } from '../components/cards/ServiceCard';
import { EmptyState } from '../components/common/EmptyState';
import { mockApi } from '../services/mockApi';
import { useStateContext } from '../context/StateContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, Layers, Building2, X } from 'lucide-react';

export const ServicesPage = () => {
  const { selectedState, currentStateObj } = useStateContext();
  const { t, getLocalized } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      const cats = await mockApi.getCategories();
      setCategories(cats.serviceCategories || []);
      setDepartments(cats.departments || []);
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const data = await mockApi.getServices({
        state: selectedState,
        category: selectedCategory,
        department: selectedDept,
        query: query
      });
      setServices(data);
      setLoading(false);
    };

    fetchServices();
  }, [selectedState, selectedCategory, selectedDept, query]);

  const handleClearFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedDept('All Departments');
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('services.title', 'Government Services')}
        subtitle={t('services.subtitle', 'Explore services from central and state government departments in one unified directory.')}
        badge={`${t('home.activeIn', 'Active')}: ${getLocalized(currentStateObj, 'name')}`}
      />

      {/* Filter and Search Bar Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Text Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('services.searchPlaceholder', 'Search services by keyword, department, or title...')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#075BA8] focus:ring-2 focus:ring-[#075BA8]/20"
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

          {/* Department Dropdown */}
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#075BA8] appearance-none cursor-pointer"
            >
              <option value="All Departments">{t('services.allDepts', 'All Departments')}</option>
              {departments.filter(d => d !== 'All Departments').map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
            {t('services.filterCategory', 'Filter by Service Category:')}
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
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
        <span>{t('services.showingCount', { count: services.length })}</span>
        {(query || selectedCategory !== 'all' || selectedDept !== 'All Departments') && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-[#075BA8] dark:text-blue-400 font-semibold hover:underline"
          >
            {t('common.resetFilters', 'Reset Filters')}
          </button>
        )}
      </div>

      {/* Services Grid (up to 3-6 columns as responsive layout) */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('services.noResults', 'No matching services found')}
          message={t('services.noResultsDesc', 'Try adjusting your department, category, or search term to discover relevant services.')}
          actionText={t('common.clearAll', 'Clear All Filters')}
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
};
