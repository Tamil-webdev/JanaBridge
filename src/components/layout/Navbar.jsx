import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { SearchBar } from '../common/SearchBar';
import { LanguageSelector } from '../common/LanguageSelector';
import { StateSelector } from '../common/StateSelector';
import {
  Mic,
  Bell,
  Eye,
  Sun,
  Moon,
  User,
  Menu,
  Bookmark,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSavedItems } from '../../context/SavedItemsContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar = ({ onOpenMobileMenu, onOpenVoiceModal, onOpenAccessibilityModal }) => {
  const { theme, toggleTheme } = useTheme();
  const { count: savedCount } = useSavedItems();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const mockNotifications = [
    {
      id: 1,
      title: t("tn.ann2Title", "Pudhumai Penn Scheme Renewal"),
      desc: t("tn.ann2Body", "Fresh semester bonafide verification deadline: 28th Feb."),
      time: "2h ago",
      unread: true
    },
    {
      id: 2,
      title: t("tn.ann1Title", "PM-KISAN 17th Installment Credited"),
      desc: t("tn.ann1Body", "DBT verified via Aadhaar-linked bank account."),
      time: "1d ago",
      unread: false
    },
    {
      id: 3,
      title: t("tn.ann3Title", "e-Sevai Portal Scheduled Maintenance"),
      desc: t("tn.ann3Body", "Sunday 02:00 AM to 05:00 AM server maintenance."),
      time: "2d ago",
      unread: false
    }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      {/* Top micro bar for National / Portal Badge */}
      <div className="bg-[#064780] text-[#EAF4FF] text-[11px] py-1 px-4 sm:px-6 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{t('portalBadge', 'Government of India & State Services Portal • Multilingual Public Gateway')}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px]">
          <Link to="/help" className="hover:underline text-blue-100">{t('nav.guidelines', 'Portal Guidelines')}</Link>
          <span>|</span>
          <StateSelector compact />
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 h-16 flex items-center justify-between gap-1 sm:gap-4">
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="default" />
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 justify-center px-2 lg:px-6">
          <SearchBar variant="navbar" onVoiceClick={onOpenVoiceModal} />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Voice Search Icon (mobile/tablet quick button) */}
          <button
            type="button"
            onClick={onOpenVoiceModal}
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-[#075BA8] dark:text-blue-400 hover:bg-[#EAF4FF] dark:hover:bg-blue-900/40 transition-colors"
            title={t('common.voice', 'Ask by Voice')}
            aria-label="Voice search"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Accessibility Options Button */}
          <button
            type="button"
            onClick={onOpenAccessibilityModal}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#075BA8] transition-colors"
            title={t('accessibility', 'Accessibility settings')}
            aria-label="Accessibility settings"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#075BA8] transition-colors"
            title={theme === 'dark' ? t('modal.light', 'Switch to light mode') : t('modal.dark', 'Switch to dark mode')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('home.latestSchemesTitle', 'Latest Updates')}</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">3 unread</span>
                </div>
                <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-center">
                  <Link to="/tamil-nadu" onClick={() => setNotificationOpen(false)} className="text-[11px] text-[#075BA8] dark:text-blue-400 font-semibold hover:underline">
                    {t('tn.announcementsTitle', 'View State Announcements')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Citizen Account Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="User account menu"
            >
              <div className="w-8 h-8 rounded-full bg-[#EAF4FF] dark:bg-slate-700 text-[#075BA8] dark:text-blue-400 font-bold flex items-center justify-center text-xs border border-blue-200 dark:border-slate-600">
                <User className="w-4 h-4" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Citizen Demo Profile</p>
                  <p className="text-[11px] text-slate-400">citizen@janabridge.demo</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/saved"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <span className="flex items-center gap-2"><Bookmark className="w-3.5 h-3.5 text-[#075BA8]" /> {t('nav.saved', 'Saved Items')}</span>
                    {savedCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#075BA8] text-white font-bold">{savedCount}</span>
                    )}
                  </Link>
                  <Link
                    to="/chat-history"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <span>{t('nav.history', 'Chat History')}</span>
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('nav.help', 'Help & Support')}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
