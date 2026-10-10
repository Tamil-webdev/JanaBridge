import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { useSavedItems } from '../context/SavedItemsContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  ArrowRight,
  Layers,
  Award,
  FileText,
  Filter
} from 'lucide-react';

export const SavedItemsPage = () => {
  const navigate = useNavigate();
  const { savedItems, removeSaved, clearAllSaved, count } = useSavedItems();
  const { t, getLocalized } = useLanguage();
  const [filterType, setFilterType] = useState('all'); // all, scheme, service, document

  const filteredItems = savedItems.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getTargetUrl = (item) => {
    if (item.type === 'scheme') return `/schemes/${item.id}`;
    if (item.type === 'service') return `/services/${item.id}`;
    if (item.type === 'document') return `/documents/${item.id}`;
    return '/';
  };

  const getItemIcon = (type) => {
    if (type === 'scheme') return <Award className="w-4 h-4 text-blue-600" />;
    if (type === 'service') return <Layers className="w-4 h-4 text-emerald-600" />;
    return <FileText className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('saved.title', 'Saved Items')}
        subtitle={t('saved.subtitle', 'Quick access to bookmarked government schemes, public services, and document guides.')}
        badge={`${count} ${t('common.saved', 'Bookmarked')}`}
        actions={
          count > 0 && (
            <button
              type="button"
              onClick={clearAllSaved}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('common.clearAll', 'Clear All Saved')}</span>
            </button>
          )
        }
      />

      {/* Filter Tabs */}
      {count > 0 && (
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: `${t('common.all', 'All Items')} (${savedItems.length})` },
            { id: 'scheme', label: `${t('nav.schemes', 'Schemes')} (${savedItems.filter(i => i.type === 'scheme').length})` },
            { id: 'service', label: `${t('nav.services', 'Services')} (${savedItems.filter(i => i.type === 'service').length})` },
            { id: 'document', label: `${t('nav.documents', 'Documents')} (${savedItems.filter(i => i.type === 'document').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterType === tab.id
                  ? 'bg-[#075BA8] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#075BA8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    {getItemIcon(item.type)}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 capitalize">
                      {item.type}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSaved(item.type, item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                    title={t('common.remove', 'Remove bookmark')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3
                  onClick={() => navigate(getTargetUrl(item))}
                  className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#075BA8] dark:group-hover:text-blue-400 cursor-pointer line-clamp-2"
                >
                  {getLocalized(item, 'name')}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{getLocalized(item, 'department')}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{getLocalized(item, 'description')}</p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {t('common.saved', 'Saved')}: {new Date(item.savedAt).toLocaleDateString()}
                </span>

                <button
                  type="button"
                  onClick={() => navigate(getTargetUrl(item))}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#075BA8] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{t('common.open', 'Open')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title={count === 0 ? t('saved.empty', 'No saved items yet') : t('saved.emptyCategory', 'No items in this category')}
          message={count === 0 ? t('saved.emptyDesc', 'Click the bookmark icon on any scheme, service, or document to save it here for fast offline reference.') : t('services.noResultsDesc', 'Try choosing another category tab above.')}
          actionText={count === 0 ? t('home.bannerBtnSchemes', 'Browse Welfare Schemes') : t('common.viewAll', 'View All Saved')}
          onAction={() => {
            if (count === 0) navigate('/schemes');
            else setFilterType('all');
          }}
        />
      )}
    </div>
  );
};
