import React, { useState } from 'react';
import { Copy, Check, Volume2, Edit3, User, Sparkles, CheckCircle, AlertTriangle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { CitationCard } from '../cards/CitationCard';
import { useLanguage } from '../../context/LanguageContext';

export const ChatMessage = ({ message, onEditPrompt }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const isUser = message.sender === 'user';
  const data = message.data || {};

  const handleCopy = () => {
    let fullText = message.text || data.directAnswer || '';
    if (data.benefits?.length) fullText += '\n\n' + t('details.benefits') + ':\n- ' + data.benefits.join('\n- ');
    if (data.eligibility?.length) fullText += '\n\n' + t('details.eligibility') + ':\n- ' + data.eligibility.join('\n- ');
    if (data.requiredDocuments?.length) fullText += '\n\n' + t('details.requiredDocs') + ':\n- ' + data.requiredDocuments.join('\n- ');
    if (data.applicationSteps?.length) fullText += '\n\n' + t('details.procedure') + ':\n' + data.applicationSteps.map((s, i) => `${i + 1}. ${s}`).join('\n');

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakToggle = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    let fullText = data.directAnswer || '';
    if (data.benefits?.length) fullText += '. ' + data.benefits.join('. ');
    if (data.applicationSteps?.length) fullText += '. ' + data.applicationSteps.join('. ');

    if (!fullText.trim()) return;

    const respLang = data.response_language || 'english';

    // Tanglish text is Latin-script; always use en-IN for readability
    let langCode = 'en-IN';
    if (respLang === 'tamil') {
      langCode = 'ta-IN';
    } else if (respLang === 'hindi') {
      langCode = 'hi-IN';
    }
    // tanglish or english → 'en-IN'

    const speak = (voices) => {
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = langCode;

      // Try exact match → then language prefix → then any available
      let voice = voices.find(v => v.lang === langCode);
      if (!voice) {
        const prefix = langCode.split('-')[0];
        voice = voices.find(v => v.lang.startsWith(prefix));
      }
      if (!voice && (respLang === 'tamil' || respLang === 'hindi')) {
        // Last resort: fall back to en-IN so at least audio plays
        voice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'));
        utterance.lang = 'en-IN';
      }
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setSpeaking(false);
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          alert('Error playing audio: ' + e.error);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speak(voices);
    } else {
      // Voices not yet loaded — wait for the event (fires once on most browsers)
      const onVoicesChanged = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        speak(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      // Safety timeout: speak anyway after 500ms even if event never fires
      setTimeout(() => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        const v = window.speechSynthesis.getVoices();
        speak(v);
      }, 500);
    }
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (isUser) {
    return (
      <div className="flex justify-end gap-2.5 mb-6 group animate-in fade-in duration-200">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[70%]">
          <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
            <span>{t('common.you', 'You')}</span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>

          <div className="relative rounded-2xl rounded-tr-xs bg-[#075BA8] text-white p-4 shadow-sm text-sm sm:text-base leading-relaxed">
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>

          {/* Edit user message action */}
          <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEditPrompt && (
              <button
                type="button"
                onClick={() => onEditPrompt(message)}
                className="text-xs text-slate-400 hover:text-[#075BA8] dark:hover:text-blue-400 flex items-center gap-1"
                title={t('common.edit')}
              >
                <Edit3 className="w-3 h-3" />
                <span>{t('common.edit')} & {t('common.resubmit')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              title={t('common.copy')}
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? t('common.copied') : t('common.copy')}</span>
            </button>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant structured response
  return (
    <div className="flex gap-3 mb-8 animate-in fade-in duration-200">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#075BA8] to-[#064780] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex-1 max-w-[95%] sm:max-w-[85%]">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#075BA8] dark:text-blue-400">
              {t('chat.assistantTitle')}
            </span>
            <span className="text-[11px] text-slate-400">• {formattedTime}</span>
            {/* Real local Ollama inference badge */}
            {!data.isMock && !data.demoMode && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                AI Grounded
              </span>
            )}
            {/* Demo Mode fallback badge */}
            {(data.isMock || data.demoMode) && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-medium">
                {t('common.mockDemo', 'Demo Mode')}
              </span>
            )}

          </div>

          <div className="flex items-center gap-1.5">
            {/* Text-to-Speech placeholder button */}
            <button
              type="button"
              onClick={handleSpeakToggle}
              className={`p-1.5 rounded-lg transition-colors ${
                speaking
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 animate-pulse'
                  : 'text-slate-400 hover:text-[#075BA8] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Listen to response (TTS Prototype)"
              aria-label="Text to speech audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t('common.copy')}
              aria-label="Copy answer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Structured Card Container */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 p-5 shadow-xs space-y-4">
          {/* Insufficient Evidence Warning Banner */}
          {data.insufficientEvidence && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                <span className="font-semibold block mb-0.5">{t('chat.insufficientEvidence')}</span>
                {t('chat.insufficientEvidenceText')}
              </div>
            </div>
          )}

          {/* 1. Direct Answer */}
          <div className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed">
            {data.directAnswer}
          </div>

          {/* 2. Relevant Benefits */}
          {data.benefits && data.benefits.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#075BA8] dark:text-blue-400 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> {t('details.benefits')}
              </h4>
              <ul className="space-y-1.5 pl-1">
                {data.benefits.map((b, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#075BA8] dark:bg-blue-400 mt-1.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Eligibility Requirements */}
          {data.eligibility && data.eligibility.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {t('details.eligibility')}
              </h4>
              <ul className="space-y-1.5 pl-1">
                {data.eligibility.map((el, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Required Supporting Documents */}
          {data.requiredDocuments && data.requiredDocuments.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> {t('details.requiredDocs')}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {data.requiredDocuments.map((doc, i) => (
                  <li key={i} className="text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-2 rounded-lg text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#075BA8] dark:text-blue-400">✓</span>
                    <span className="truncate">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. Application Steps */}
          {data.applicationSteps && data.applicationSteps.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-[#075BA8]" /> {t('details.procedure')}
              </h4>
              <ol className="space-y-2">
                {data.applicationSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-[#EAF4FF] dark:bg-slate-700 text-[#075BA8] dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* 6. Important Notes */}
          {data.importantNotes && (
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-slate-900/80 border border-blue-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-[#075BA8] dark:text-blue-400 block mb-0.5">{t('chat.importantNote')}</span>
              {data.importantNotes}
            </div>
          )}

          {/* 7. Source Citations Cards */}
          {data.citations && data.citations.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('chat.evidenceCitations', { count: data.citations.length })}
                </span>
                <span className="text-[10px] text-slate-400">{t('chat.verifiedOfficial')}</span>
              </div>
              <div className="space-y-1.5">
                {data.citations.map((c, i) => (
                  <CitationCard key={i} citation={c} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
