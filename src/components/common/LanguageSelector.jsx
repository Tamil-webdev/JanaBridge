import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const LanguageSelector = ({ variant = 'default' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-[#075BA8] hover:text-[#075BA8] transition-colors focus:ring-2 focus:ring-[#075BA8]/20"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-[#075BA8] dark:text-blue-400 shrink-0" />
        <span className="font-medium hidden sm:inline">{currentLang.native}</span>
        <span className="font-bold sm:hidden uppercase text-xs">{currentLang.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-left transition-colors ${
                    isSelected
                      ? 'bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-700 dark:text-blue-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.native}</span>
                    <span className="text-[10px] text-slate-400">{lang.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#075BA8] dark:text-blue-400" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
