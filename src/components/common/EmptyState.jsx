import React from 'react';
import { SearchX, FolderX, FileQuestion, ArrowRight } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = "No results found",
  message = "We couldn't find anything matching your search criteria.",
  actionText = null,
  onAction = null
}) => {
  return (
    <div className="py-12 px-4 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center max-w-md mx-auto my-6 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-[#EAF4FF] dark:bg-slate-700 text-[#075BA8] dark:text-blue-400 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {message}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075BA8] hover:bg-[#064780] text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
