import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { DocumentCard } from '../components/cards/DocumentCard';
import { EmptyState } from '../components/common/EmptyState';
import { mockApi } from '../services/mockApi';
import { useLanguage } from '../context/LanguageContext';
import { Search, FileText, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const DocumentGuidePage = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      const data = await mockApi.getDocuments(query);
      if (selectedCategory !== 'all') {
        setDocuments(data.filter(d => d.category.toLowerCase().includes(selectedCategory.toLowerCase())));
      } else {
        setDocuments(data);
      }
      setLoading(false);
    };
    fetchDocs();
  }, [query, selectedCategory]);

  const docCategories = [
    { id: 'all', label: t('common.all', 'All Documents') },
    { id: 'revenue', label: t('cat.revenue', 'Revenue & Certificates') },
    { id: 'identity', label: t('cat.identity', 'Identity & Citizenship') },
    { id: 'educational', label: t('cat.educational', 'Educational Records') },
    { id: 'land', label: t('cat.land', 'Land & Property') },
    { id: 'food', label: t('cat.food', 'Food & Civil Supplies') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('documents.title', 'Document Guide & Checklist')}
        subtitle={t('documents.subtitle', 'Understand which supporting documents, certificates, and records are needed before submitting applications.')}
        badge={t('home.bannerBadge', 'Citizen Guidance')}
      />

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('documents.searchPlaceholder', 'Search documents (e.g., income certificate, marksheet, patta, aadhaar)...')}
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

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2">
          {docCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#075BA8] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 leading-relaxed flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>{t('documents.advisoryTitle', 'General Guidance Notice:')}</strong> {t('documents.advisoryText', 'Document requirements depend on individual scheme rules and may vary slightly between urban and rural local bodies. Always verify official requirements during application filing.')}
        </div>
      </div>

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('documents.noResults', 'No documents found')}
          message={t('documents.noResultsDesc', "We couldn't locate documents matching your keyword. Try searching for common terms like 'income', 'caste', or 'marksheet'.")}
          actionText={t('common.clearAll', 'Clear Search')}
          onAction={() => { setQuery(''); setSelectedCategory('all'); }}
        />
      )}
    </div>
  );
};
