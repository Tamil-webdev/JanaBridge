import React, { useState } from 'react';
import { BookOpen, ShieldCheck, ChevronDown, ChevronUp, ExternalLink, Quote } from 'lucide-react';

export const CitationCard = ({ citation, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 p-3 text-xs transition-all">
      <div
        className="flex items-start justify-between gap-2 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-[#EAF4FF] dark:bg-slate-700 text-[#075BA8] dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
            [{index + 1}]
          </span>
          <div>
            <h5 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
              <span>{citation.title}</span>
              {citation.page && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  p. {citation.page}
                </span>
              )}
            </h5>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span>{citation.sourceType}</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                {citation.verificationStatus}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
          aria-label={expanded ? 'Collapse citation' : 'Expand citation'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Snippet body */}
      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 pl-7 text-slate-600 dark:text-slate-300 italic flex items-start gap-1.5 leading-relaxed bg-white/50 dark:bg-slate-800/40 p-2.5 rounded-lg">
          <Quote className="w-3.5 h-3.5 text-[#075BA8] shrink-0 mt-0.5 not-italic" />
          <span>"{citation.snippet}"</span>
        </div>
      )}
    </div>
  );
};
