import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Edit3, Send, X, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceModal = ({ isOpen, onClose, initialQuery = '' }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState(initialQuery);
  const [isEditing, setIsEditing] = useState(false);
  const [browserSupport, setBrowserSupport] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Suggested multilingual voice demo prompts
  const samplePrompts = {
    en: [
      "How do I apply for an income certificate?",
      "What schemes are available for senior citizens in Tamil Nadu?",
      "What documents do I need for a smart ration card?",
      "Find scholarships for college students"
    ],
    ta: [
      "வருமானச் சான்றிதழுக்கு எவ்வாறு விண்ணப்பிப்பது?",
      "தமிழ்நாட்டில் மூத்த குடிமக்களுக்கான திட்டங்கள் என்னென்ன?",
      "ரேஷன் கார்டுக்கு என்னென்ன ஆவணங்கள் தேவை?",
      "கல்லூரி மாணவர்களுக்கான கல்வி உதவித்தொகை"
    ],
    hi: [
      "आय प्रमाण पत्र के लिए कैसे आवेदन करें?",
      "तमिलनाडु में वरिष्ठ नागरिकों के लिए क्या योजनाएं हैं?",
      "स्मार्ट राशन कार्ड के लिए कौन से दस्तावेज चाहिए?",
      "कॉलेज छात्रों के लिए छात्रवृत्ति योजनाएं"
    ]
  };

  const activePrompts = samplePrompts[language] || samplePrompts.en;

  useEffect(() => {
    if (isOpen) {
      setTranscribedText(initialQuery || '');
      setIsEditing(false);
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [isOpen, language]);

  const startListening = () => {
    setIsListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setBrowserSupport(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscribedText(currentText);
        };

        recognition.onerror = () => {
          simulateDemoVoiceInput();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech recognition start failed; falling back to simulated prototype audio', err);
      }
    }

    simulateDemoVoiceInput();
  };

  const simulateDemoVoiceInput = () => {
    setBrowserSupport(false);
    const randomPrompt = activePrompts[Math.floor(Math.random() * activePrompts.length)];
    let index = 0;
    setTranscribedText('');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (index < randomPrompt.length) {
        setTranscribedText(randomPrompt.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timerRef.current);
        setIsListening(false);
      }
    }, 45);
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleSubmit = () => {
    if (!transcribedText.trim()) return;
    stopListening();
    onClose();
    navigate(`/chat?q=${encodeURIComponent(transcribedText.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 id="voice-modal-title" className="text-base font-bold text-slate-800 dark:text-white">
              {t('modal.voiceTitle')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visualizer / Microphone Center */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="relative my-4">
            {isListening && (
              <>
                <span className="absolute inset-0 -m-4 rounded-full bg-[#075BA8]/15 dark:bg-blue-500/20 animate-ping opacity-75" />
                <span className="absolute inset-0 -m-2 rounded-full bg-[#075BA8]/20 dark:bg-blue-500/30 animate-pulse" />
              </>
            )}

            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-[#075BA8] text-white hover:bg-[#064780]'
              }`}
              aria-label={isListening ? t('stopListening') : t('modal.voiceSpeakAgain')}
            >
              {isListening ? <Mic className="w-9 h-9" /> : <MicOff className="w-9 h-9" />}
            </button>
          </div>

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {isListening ? t('listeningLabel') : t('modal.voiceReady')}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {browserSupport ? t('modal.voiceWebSpeech') : t('modal.voiceSimulated')}
          </p>

          {/* Transcribed text box */}
          <div className="w-full mt-5 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('modal.voicePreview')}
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 text-xs text-[#075BA8] dark:text-blue-400 font-medium hover:underline"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? t('modal.voiceDoneEditing') : t('modal.voiceEditText')}</span>
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-[#075BA8] bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                placeholder={t('chat.askPlaceholder')}
                autoFocus
              />
            ) : (
              <div className="min-h-[72px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 text-sm">
                {transcribedText ? (
                  <span>{transcribedText}</span>
                ) : (
                  <span className="text-slate-400 italic">{t('chat.askPlaceholder')}</span>
                )}
              </div>
            )}
          </div>

          {/* Quick sample chips */}
          <div className="w-full mt-3 text-left">
            <p className="text-[11px] text-slate-400 mb-1.5">{t('modal.voiceSuggestions')}</p>
            <div className="flex flex-wrap gap-1.5">
              {activePrompts.slice(0, 2).map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTranscribedText(prompt);
                    setIsListening(false);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700/60 hover:bg-[#EAF4FF] hover:text-[#075BA8] dark:hover:bg-blue-900/30 rounded-lg text-slate-600 dark:text-slate-300 transition-colors text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex gap-2">
            {isListening ? (
              <button
                type="button"
                onClick={stopListening}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t('stopListening')}
              </button>
            ) : (
              <button
                type="button"
                onClick={startListening}
                className="px-3.5 py-2 text-xs font-medium rounded-xl border border-[#075BA8] text-[#075BA8] dark:text-blue-400 hover:bg-[#EAF4FF] dark:hover:bg-blue-900/30 flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{t('modal.voiceSpeakAgain')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              {t('cancelVoice')}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!transcribedText.trim()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#075BA8] text-white hover:bg-[#064780] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <span>{t('submitVoice')}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
