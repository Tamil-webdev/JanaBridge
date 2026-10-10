import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ChatComposer = ({
  onSend,
  onVoiceClick,
  disabled = false,
  editingMessage = null,
  onCancelEdit = null
}) => {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text);
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim(), editingMessage?.id);
    setText('');
    if (editingMessage && onCancelEdit) onCancelEdit();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      {/* Editing prompt banner */}
      {editingMessage && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <span className="font-medium">{t('chat.editingPrompt')}</span>
          <button
            type="button"
            onClick={() => {
              setText('');
              if (onCancelEdit) onCancelEdit();
            }}
            className="p-1 hover:text-amber-900"
            aria-label={t('common.cancel')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md p-2 focus-within:border-[#075BA8] focus-within:ring-2 focus-within:ring-[#075BA8]/20 transition-all"
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.askPlaceholder')}
          rows={2}
          disabled={disabled}
          className="w-full bg-transparent p-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
          aria-label={t('chat.assistantTitle')}
        />

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 px-2">
          <div className="flex items-center gap-1.5">
            {onVoiceClick && (
              <button
                type="button"
                onClick={onVoiceClick}
                disabled={disabled}
                className="p-2 rounded-xl text-[#075BA8] dark:text-blue-400 hover:bg-[#EAF4FF] dark:hover:bg-blue-900/30 transition-colors"
                title={t('common.voice')}
                aria-label={t('common.voice')}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {t('chat.pressEnter')}
            </span>
          </div>

          <button
            type="submit"
            disabled={!text.trim() || disabled}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075BA8] hover:bg-[#064780] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs transition-all shadow-xs active:scale-98"
          >
            <span>{editingMessage ? t('common.resubmit') : t('common.send')}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
