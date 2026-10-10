import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  badge = null,
  actions = null,
  children = null
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-800 dark:text-blue-400 dark:border dark:border-slate-700">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
