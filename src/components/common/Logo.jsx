import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'default', showTagline = false }) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <Link to="/" className="flex items-center gap-2.5 group focus:outline-none" aria-label="JanaBridge Home">
      {/* Original Bridge & Document Emblem */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#075BA8] to-[#064780] shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0 ${
        isSmall ? 'w-8 h-8' : isLarge ? 'w-12 h-12' : 'w-8 h-8 sm:w-10 sm:h-10'
      }`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isSmall ? 'w-5 h-5' : isLarge ? 'w-8 h-8' : 'w-5 h-5 sm:w-6 sm:h-6'}
        >
          {/* Bridge arch */}
          <path
            d="M4 22C7 15 11 11 16 11C21 11 25 15 28 22"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Deck */}
          <path
            d="M3 22H29"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Support pillars */}
          <line x1="10" y1="17" x2="10" y2="22" stroke="#EAF4FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="13" x2="16" y2="22" stroke="#EAF4FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="17" x2="22" y2="22" stroke="#EAF4FF" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bookmark / Document mark overhead */}
          <path
            d="M13.5 5.5C13.5 5 14 4.5 14.5 4.5H17.5C18 4.5 18.5 5 18.5 5.5V9.5L16 8L13.5 9.5V5.5Z"
            fill="#F59E0B"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className={`font-extrabold tracking-tight text-[#075BA8] dark:text-blue-400 ${
            isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-base sm:text-xl'
          }`}>
            Jana<span className="text-[#1F2937] dark:text-white">Bridge</span>
          </span>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-800 dark:text-blue-400 dark:border dark:border-slate-700">
            Gov
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Bridging People to Government Services
          </span>
        )}
      </div>
    </Link>
  );
};
