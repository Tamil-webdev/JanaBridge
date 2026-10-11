import React from 'react';
import { NavLink } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSavedItems } from '../../context/SavedItemsContext';

export const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
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

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 select-none shrink-0 sticky top-24 h-[calc(100vh-6rem)] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto" aria-label="Sidebar Navigation">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all group min-w-0 ${
                  isActive
                    ? 'bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-800 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <IconComponent
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isCollapsed ? '' : ''
                }`}
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                  <span className={`leading-snug break-words flex-1 min-w-0 ${
                    language === 'ta' ? 'text-[13px]' : 'text-sm'
                  }`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#075BA8] text-white dark:bg-blue-600 whitespace-nowrap">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#075BA8] text-white whitespace-nowrap">
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
          aria-label={isCollapsed ? t('common.open', 'Expand sidebar') : t('nav.collapse', 'Collapse sidebar')}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>{t('nav.collapse', 'Collapse Sidebar')}</span>
            </>
          )}
        </button>
      </div>

      {/* Footer Info / Links */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <NavLink to="/help" className="hover:underline">{t('nav.privacy', 'Privacy')}</NavLink>
            <span>•</span>
            <NavLink to="/help" className="hover:underline">{t('nav.terms', 'Terms')}</NavLink>
            <span>•</span>
            <NavLink to="/help" className="hover:underline">{t('nav.contact', 'Contact')}</NavLink>
          </div>
          <p className="text-[10px] text-slate-400">© {t('brandName', 'JanaBridge')} • Demo</p>
        </div>
      )}
    </aside>
  );
};
