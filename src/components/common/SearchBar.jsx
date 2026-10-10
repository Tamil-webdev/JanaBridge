import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, X, ArrowRight, FileText, Award, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { searchService } from '../../services/searchService';
import { useStateContext } from '../../context/StateContext';

export const SearchBar = ({
  placeholder,
  variant = 'default', // 'hero' | 'navbar' | 'compact'
  onVoiceClick,
  initialQuery = '',
  autoFocus = false
}) => {
  const { t, getLocalized } = useLanguage();
  const { selectedState } = useStateContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (query.trim().length > 1 && variant === 'navbar') {
      const timer = setTimeout(async () => {
        const res = await searchService.globalSearch(query, selectedState);
        setResults(res);
        setIsOpen(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setResults(null);
      setIsOpen(false);
    }
  }, [query, selectedState, variant]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/services?q=${encodeURIComponent(query.trim())}`);
  };

  const isHero = variant === 'hero';
  const isNavbar = variant === 'navbar';

  return (
    <div className={`relative w-full ${isNavbar ? 'max-w-md lg:max-w-lg' : ''}`} ref={wrapperRef}>
      <form
        onSubmit={handleSearch}
        className={`flex items-center transition-all ${
          isHero
            ? 'bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 focus-within:ring-4 focus-within:ring-[#075BA8]/15 focus-within:border-[#075BA8]'
            : isNavbar
            ? 'bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 px-3 py-1.5 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-[#075BA8] focus-within:ring-2 focus-within:ring-[#075BA8]/20'
            : 'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2'
        }`}
      >
        <Search className={`shrink-0 text-slate-400 dark:text-slate-500 ${isHero ? 'w-6 h-6 ml-2 mr-3 text-[#075BA8] dark:text-blue-400' : 'w-4 h-4 mr-2'}`} />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || (isHero ? t('home.searchPlaceholder') : t('home.searchGlobalPlaceholder'))}
          className={`w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
            isHero ? 'text-base sm:text-lg font-normal' : 'text-xs sm:text-sm'
          }`}
          autoFocus={autoFocus}
          aria-label={t('common.search')}
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 mr-1"
            aria-label={t('common.clearAll')}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice Trigger Icon Button */}
        {onVoiceClick && (
          <button
            type="button"
            onClick={onVoiceClick}
            className={`flex items-center justify-center rounded-xl text-[#075BA8] dark:text-blue-400 hover:bg-[#EAF4FF] dark:hover:bg-slate-700 transition-colors ${
              isHero ? 'p-2.5 mr-2' : 'p-1.5 ml-1'
            }`}
            title={t('common.voice')}
            aria-label={t('common.voice')}
          >
            <Mic className={isHero ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
        )}

        {/* Search Submit Button */}
        {isHero && (
          <button
            type="submit"
            className="hidden sm:inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-[#075BA8] hover:bg-[#064780] text-white font-semibold text-sm transition-all shadow-sm active:scale-98"
          >
            <span>{t('common.search')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Global Live Preview Dropdown (Navbar variant) */}
      {isNavbar && isOpen && results && results.totalCount > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 max-h-96 overflow-y-auto">
          {results.schemes.length > 0 && (
            <div className="px-3 py-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#075BA8] dark:text-blue-400 flex items-center gap-1 mb-1">
                <Award className="w-3 h-3" /> {t('nav.schemes')} ({results.schemes.length})
              </span>
              {results.schemes.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(`/schemes/${item.id}`);
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex flex-col"
                >
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{getLocalized(item, 'name')}</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{getLocalized(item, 'description')}</span>
                </div>
              ))}
            </div>
          )}

          {results.services.length > 0 && (
            <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                <Layers className="w-3 h-3" /> {t('nav.services')} ({results.services.length})
              </span>
              {results.services.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(`/services/${item.id}`);
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex flex-col"
                >
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{getLocalized(item, 'name')}</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{getLocalized(item, 'department')}</span>
                </div>
              ))}
            </div>
          )}

          {results.documents.length > 0 && (
            <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-1">
                <FileText className="w-3 h-3" /> {t('nav.documents')} ({results.documents.length})
              </span>
              {results.documents.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(`/documents/${item.id}`);
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex flex-col"
                >
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{getLocalized(item, 'name')}</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{getLocalized(item, 'purpose')}</span>
                </div>
              ))}
            </div>
          )}

          <div className="px-3 pt-2 pb-1 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full text-center py-1.5 text-xs font-semibold text-[#075BA8] dark:text-blue-400 hover:underline"
            >
              {t('common.viewAll')} "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
