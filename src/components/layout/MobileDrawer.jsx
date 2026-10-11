import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { StateSelector } from '../common/StateSelector';
import {
  Home,
  Layers,
  Award,
  FileText,
  MessageSquare,
  Landmark,
  Bookmark,
  History,
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSavedItems } from '../../context/SavedItemsContext';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { count: savedCount } = useSavedItems();

  const navItems = [
    { to: '/', label: t('navHome'), icon: Home, end: true },
    { to: '/services', label: t('navServices'), icon: Layers },
    { to: '/schemes', label: t('navSchemes'), icon: Award },
    { to: '/documents', label: t('navDocuments'), icon: FileText },
    { to: '/chat', label: t('navChat'), icon: MessageSquare, badge: t('aiRagBadge', 'AI RAG') },
    { to: '/recommend', label: t('navRecommend', 'Scheme Advisor'), icon: Sparkles, badge: 'NEW' },
    { to: '/tamil-nadu', label: t('navTamilNadu'), icon: Landmark, badge: t('focusBadge', 'Focus') },
    { to: '/saved', label: t('navSaved'), icon: Bookmark, count: savedCount },
    { to: '/chat-history', label: t('navHistory'), icon: History },
    { to: '/help', label: t('navHelp'), icon: HelpCircle },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col justify-between animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <Logo size="small" />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* State selector mobile */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">{t('stateSelectorLabel', 'Select State / UT')}</span>
            <StateSelector />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors min-w-0 ${
                      isActive
                        ? 'bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-800 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                    }`
                  }
                >
                  <IconComponent className="w-5 h-5 shrink-0" />
                  <span className={`flex-1 min-w-0 leading-snug break-words ${
                    language === 'ta' ? 'text-[13px]' : 'text-sm'
                  }`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#075BA8] text-white whitespace-nowrap">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#075BA8] text-white whitespace-nowrap">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 dark:text-slate-300">{t('brandName', 'JanaBridge')}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{t('tagline', 'Bridging People to Government Services')}</p>
        </div>
      </div>
    </div>
  );
};
