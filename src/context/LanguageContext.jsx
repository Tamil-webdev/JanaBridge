import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = ['en', 'ta', 'hi'];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('janabridge_lang');
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : 'en';
  });

  const setLanguage = (lang) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('janabridge_lang', lang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'ta') {
      document.title = 'ஜனபிரிட்ஜ் — அரசு சேவைகளுக்கான மக்கள் பாலம்';
    } else if (language === 'hi') {
      document.title = 'जनब्रिज — सरकारी सेवाओं के लिए नागरिक सेतु';
    } else {
      document.title = 'JanaBridge — Bridging People to Government Services';
    }
  }, [language]);

  /**
   * Universal translation function supporting dot-notation, flat keys, and param interpolation
   * Example: t("nav.home"), t("services.showingCount", { count: 12 }), t("navHome")
   */
  const t = (key, fallbackOrParams = '') => {
    let params = {};
    let fallback = '';

    if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
      params = fallbackOrParams;
    } else if (typeof fallbackOrParams === 'string') {
      fallback = fallbackOrParams;
    }

    const dict = translations[language] || translations.en;
    let result = dict[key];

    // Fallback to English dictionary if missing in current language
    if (!result && translations.en) {
      result = translations.en[key];
    }

    // Fallback provided by caller or readable key
    if (!result) {
      result = fallback || key;
    }

    // Variable interpolation like {count}, {district}
    if (typeof result === 'string' && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([paramKey, val]) => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return result;
  };

  /**
   * Helper function to extract localized string or array from mock JSON records
   */
  const getLocalized = (item, field = 'name') => {
    if (!item) return '';

    // If item has language keyed object: { name: { en: '...', ta: '...', hi: '...' } }
    if (item[field] && typeof item[field] === 'object' && !Array.isArray(item[field])) {
      return item[field][language] || item[field].en || item[field].ta || item[field].hi || '';
    }

    // If item has language-prefixed/suffixed fields (e.g. tamilName, hindiName, tamilBenefits)
    const langPrefix = language === 'ta' ? 'tamil' : language === 'hi' ? 'hindi' : null;
    if (langPrefix) {
      const specializedKey = `${langPrefix}${field.charAt(0).toUpperCase() + field.slice(1)}`;
      if (item[specializedKey] !== undefined && item[specializedKey] !== null) {
        return item[specializedKey];
      }
    }

    // Default to base field
    return item[field] !== undefined && item[field] !== null ? item[field] : '';
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      getLocalized,
      supportedLanguages: [
        { code: 'en', label: 'English', native: 'English' },
        { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
        { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
      ]
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
