import React, { useState, useRef, useEffect } from 'react';
import { useStateContext } from '../../context/StateContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, ChevronDown, Check } from 'lucide-react';

export const StateSelector = ({ compact = false }) => {
  const { selectedState, setSelectedState, allStates, currentStateObj } = useStateContext();
  const { t, getLocalized } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStates = allStates.filter(s => {
    const q = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(q) ||
      (s.tamilName && s.tamilName.toLowerCase().includes(q)) ||
      (s.hindiName && s.hindiName.toLowerCase().includes(q));
  });

  const selectedDisplayName = currentStateObj ? getLocalized(currentStateObj, 'name') : t('common.selectState', 'Select State');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-[#075BA8] hover:text-[#075BA8] transition-colors focus:ring-2 focus:ring-[#075BA8]/20 ${
          compact ? 'max-w-[140px]' : 'max-w-[200px]'
        }`}
        aria-expanded={isOpen}
        aria-label={t('common.selectState', 'Select State')}
      >
        <MapPin className="w-3.5 h-3.5 text-[#075BA8] dark:text-blue-400 shrink-0" />
        <span className="truncate">{selectedDisplayName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-64 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50">
          <div className="mb-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('common.filterStates', 'Filter states / UTs...')}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-[#075BA8] text-slate-800 dark:text-slate-100"
              autoFocus
            />
          </div>

          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {filteredStates.map((st) => {
              const isSelected = st.id === selectedState;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setSelectedState(st.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-700 dark:text-blue-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="truncate">{getLocalized(st, 'name')}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#075BA8] dark:text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

