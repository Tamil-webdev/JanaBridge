import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Send, Mic, MicOff, User, Sparkles, CheckCircle, AlertCircle,
  Info, ChevronDown, ChevronUp, ExternalLink, RotateCcw, Shield,
  FileText, ArrowRight, Volume2, Trash2, Eye, X, HelpCircle,
  Check, Clock, Search
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  processProfileInput,
  processFollowUp,
  formatMatchResult,
  buildRecommendationNarrative,
  profileStorage,
} from '../services/recommendationService';
import { summarizeProfile } from '../utils/profileExtractor';
import schemesData from '../data/schemes.json';

// ── Status badge config ──────────────────────────────────────
const STATUS_CONFIG = {
  potentially_eligible: {
    icon: CheckCircle,
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    label: { en: 'Potentially Eligible', ta: 'தகுதி இருக்கலாம்', hi: 'संभावित पात्र' },
  },
  needs_more_info: {
    icon: Search,
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    label: { en: 'Needs More Info', ta: 'கூடுதல் தகவல் தேவை', hi: 'और जानकारी चाहिए' },
  },
  not_eligible: {
    icon: X,
    color: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    label: { en: 'Not Eligible', ta: 'தகுதியற்றவர்', hi: 'पात्र नहीं' },
  },
  unable_to_verify: {
    icon: AlertCircle,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    label: { en: 'Verify Officially', ta: 'அதிகாரப்பூர்வமாக சரிபார்க்கவும்', hi: 'आधिकारिक रूप से जांचें' },
  },
};

// ── SchemeRecommendationCard ──────────────────────────────────
function SchemeRecommendationCard({ match, scheme, lang, onSpeak }) {
  const [expanded, setExpanded] = useState(false);
  if (!match || !scheme) return null;

  const formatted = formatMatchResult(match, scheme, lang);
  const cfg = STATUS_CONFIG[match.status] || STATUS_CONFIG.unable_to_verify;
  const Icon = cfg.icon;
  const statusLabel = cfg.label[lang] || cfg.label.en;

  return (
    <div className={`rounded-2xl border ${cfg.bg} p-4 transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${cfg.color}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {formatted.schemeName}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.badge}`}>
                {statusLabel}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {formatted.summary}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors shrink-0"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Criteria pills */}
      {(formatted.satisfiedCriteria.length > 0 || formatted.unknownCriteria.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {formatted.satisfiedCriteria.map((c, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium">
              <Check className="w-2.5 h-2.5" />{c.label}
            </span>
          ))}
          {formatted.unknownCriteria.map((c, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-medium">
              <HelpCircle className="w-2.5 h-2.5" />{c.label}
            </span>
          ))}
          {formatted.failedCriteria.map((c, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 text-[10px] font-medium">
              <X className="w-2.5 h-2.5" />{c.label}
            </span>
          ))}
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-4 space-y-3 border-t border-current/10 pt-3">
          {formatted.benefits.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#075BA8] dark:text-blue-400 mb-1.5">Benefits</h4>
              <ul className="space-y-1">
                {formatted.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#075BA8] mt-1.5 shrink-0" />{b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {formatted.requiredDocuments.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Required Documents
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {formatted.requiredDocuments.map((d, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 rounded-lg p-1.5 border border-slate-200/60 dark:border-slate-700">
                    <span className="text-[#075BA8] font-bold text-[10px]">✓</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {formatted.applicationSteps.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-[#075BA8]" /> How to Apply
              </h4>
              <ol className="space-y-1.5">
                {formatted.applicationSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-[#EAF4FF] dark:bg-slate-700 text-[#075BA8] dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">{i + 1}</span>
                    <span className="mt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Official source */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-[10px] text-slate-400">
              <Shield className="w-3 h-3 inline mr-1" />
              {formatted.verificationStatus} · Last verified: {formatted.lastVerifiedAt}
            </div>
            <div className="flex items-center gap-2">
              {onSpeak && (
                <button
                  type="button"
                  onClick={() => onSpeak(formatted)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#075BA8] hover:bg-white/80 dark:hover:bg-slate-700 transition-colors"
                  title="Read aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
              {formatted.officialSourceUrl && (
                <a
                  href={formatted.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[#075BA8] dark:text-blue-400 bg-white/80 dark:bg-slate-700/60 hover:bg-[#EAF4FF] dark:hover:bg-blue-900/30 transition-colors border border-[#075BA8]/20"
                >
                  Apply <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ProfileSummaryPanel ────────────────────────────────────
function ProfileSummaryPanel({ profile, onClear, lang }) {
  const lines = summarizeProfile(profile, lang);
  if (!lines.length) return null;

  return (
    <div className="rounded-2xl bg-[#EAF4FF] dark:bg-slate-800/60 border border-[#075BA8]/20 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#075BA8] dark:text-blue-400 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          {lang === 'ta' ? 'உங்கள் சுயவிவரம்' : lang === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your Profile (extracted)'}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-[10px] text-rose-500 hover:text-rose-700 transition-colors"
          title="Clear profile"
        >
          <Trash2 className="w-3 h-3" />
          {lang === 'ta' ? 'நீக்கு' : lang === 'hi' ? 'साफ करें' : 'Clear'}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {lines.map((line, i) => (
          <span key={i} className="px-2 py-1 bg-white/80 dark:bg-slate-700/60 rounded-lg text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600">
            {line}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
        <Eye className="w-3 h-3" />
        {lang === 'ta'
          ? 'இந்த தகவல் இந்த அமர்வில் மட்டுமே தற்காலிகமாக சேமிக்கப்பட்டுள்ளது.'
          : lang === 'hi'
          ? 'यह जानकारी केवल इस सत्र के लिए अस्थायी रूप से संग्रहीत है।'
          : 'This information is stored temporarily for this session only.'}
      </p>
    </div>
  );
}

// ── DisclaimerBanner ─────────────────────────────────────────
function DisclaimerBanner({ lang }) {
  return (
    <div className="rounded-xl bg-blue-50 dark:bg-slate-800/50 border border-blue-200 dark:border-slate-700 p-3 flex items-start gap-2.5">
      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
      <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
        {lang === 'ta'
          ? 'இந்த பரிந்துரைகள் ஆரம்பநிலை மட்டுமே. அதிகாரப்பூர்வ அரசு துறைகளே இறுதித் தகுதியை தீர்மானிக்கின்றன. ஆதார், PAN, வங்கிக் கணக்கு விவரங்கள் எதுவும் கேட்கப்படவில்லை.'
          : lang === 'hi'
          ? 'ये सिफारिशें प्रारंभिक हैं। आधिकारिक सरकारी विभाग ही अंतिम पात्रता तय करते हैं। आधार, पैन, बैंक खाता नंबर नहीं मांगे जाते।'
          : 'These are preliminary recommendations. Official authorities determine final eligibility. No Aadhaar, PAN or bank account numbers are required or stored.'}
      </p>
    </div>
  );
}

// ── ChatBubble ────────────────────────────────────────────────
function ChatBubble({ role, text, isLoading, children }) {
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in duration-200">
        <div className="max-w-[80%] bg-[#075BA8] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm shadow-sm">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 mb-4 animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#075BA8] to-[#064780] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 pt-2">
            <span className="w-2 h-2 rounded-full bg-[#075BA8] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#075BA8] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#075BA8] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div className="space-y-3">
            {text && <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">{text}</p>}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sample prompts ────────────────────────────────────────────
const SAMPLE_PROMPTS = {
  en: [
    "I am Ravi, 35 years old, live in rural Tamil Nadu, earn ₹1,80,000 per year, work as an agricultural labourer, own 1 acre of dry land, and have two children.",
    "I am a 28-year-old woman in Tamil Nadu with an annual income of ₹1,50,000. I am the head of my family.",
    "I am 22 years old, female, studied in a Tamil Nadu government school, now doing my BA degree in Chennai.",
    "I am 45 years old, live in a rural village in Tamil Nadu, earn ₹90,000 per year, and my family lives in a kutcha house.",
  ],
  ta: [
    "என் பெயர் ரவி. வயது 35. தமிழ்நாட்டில் கிராமப்புறத்தில் வசிக்கிறேன். ஆண்டு வருமானம் ₹1,80,000. விவசாய தொழிலாளி. 1 ஏக்கர் புஞ்சை நிலம் உள்ளது.",
    "நான் 28 வயதுள்ள பெண். தமிழ்நாட்டில் வசிக்கிறேன். குடும்பத் தலைவி. ஆண்டு வருமானம் ₹1,50,000.",
    "வயது 22, பெண். தமிழ்நாடு அரசுப் பள்ளியில் படித்தேன். இப்போது சென்னையில் BA படிக்கிறேன்.",
  ],
  hi: [
    "मेरा नाम रवि है, उम्र 35 साल, ग्रामीण तमिलनाडु में रहता हूं, सालाना आय ₹1,80,000, खेतिहर मजदूर हूं, 1 एकड़ जमीन है।",
    "मैं 28 साल की महिला हूं, तमिलनाडु में रहती हूं, परिवार की मुखिया हूं, सालाना आय ₹1,50,000।",
  ],
};

// ── Main Page ─────────────────────────────────────────────────
export const RecommendationPage = () => {
  const { language, t } = useLanguage();
  const lang = language; // 'en' | 'ta' | 'hi'
  const uiLang = lang;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [currentMatches, setCurrentMatches] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [persistConsent, setPersistConsent] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const welcomeText = {
    en: "Hello! I'm JanaBridge's Scheme Advisor. Tell me about yourself — your age, location, income, occupation, and family situation — and I'll find government schemes you may be eligible for.\n\nYou can type or speak naturally in English, Tamil, Tanglish, or Hindi. No Aadhaar or PAN number needed.",
    ta: "வணக்கம்! நான் ஜனபிரிட்ஜின் திட்ட ஆலோசகர். உங்கள் வயது, இருப்பிடம், வருமானம், தொழில் மற்றும் குடும்ப விவரங்களை தெரிவியுங்கள் — நீங்கள் தகுதிபெறக்கூடிய அரசு திட்டங்களை கண்டுபிடிப்பேன்.\n\nஆதார் அல்லது PAN தேவையில்லை.",
    hi: "नमस्ते! मैं JanaBridge का योजना सलाहकार हूं। अपनी उम्र, स्थान, आय, पेशा और परिवार के बारे में बताएं — मैं आपके लिए उपयुक्त सरकारी योजनाएं खोजूंगा।\n\nआधार या पैन नंबर की जरूरत नहीं।",
  };

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{ id: 'welcome', role: 'assistant', text: welcomeText[uiLang] || welcomeText.en }]);
    // Restore session profile if any
    const saved = profileStorage.getSession();
    if (saved) setCurrentProfile(saved);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── TTS ────────────────────────────────────────────────────
  const speakText = useCallback((text, langCode = 'en-IN') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang === langCode) || voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
    if (voice) utter.voice = voice;
    const doSpeak = () => window.speechSynthesis.speak(utter);
    voices.length > 0 ? doSpeak() : window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true });
  }, []);

  const handleSpeakScheme = useCallback((formatted) => {
    const langCode = uiLang === 'ta' ? 'ta-IN' : uiLang === 'hi' ? 'hi-IN' : 'en-IN';
    const parts = [
      formatted.schemeName,
      formatted.summary,
      ...(formatted.benefits?.slice(0, 2) || []),
    ].filter(Boolean).join('. ');
    speakText(parts, langCode);
  }, [uiLang, speakText]);

  // ── Voice input ────────────────────────────────────────────
  const startListening = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) { alert('Speech recognition not supported. Please type your query.'); return; }
    const rec = new SpeechRec();
    rec.lang = uiLang === 'ta' ? 'ta-IN' : uiLang === 'hi' ? 'hi-IN' : 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setInput(t);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // ── Submit handler ─────────────────────────────────────────
  const handleSubmit = async (text) => {
    const query = (text || input).trim();
    if (!query) return;

    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: query }]);
    setIsLoading(true);

    // Add loading bubble
    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, role: 'assistant', isLoading: true }]);

    try {
      let result;
      if (currentProfile && currentMatches.length > 0) {
        // Follow-up
        const followUp = await processFollowUp(query, currentProfile, currentMatches);
        if (followUp.profile && followUp.matches) {
          // Profile was updated
          result = {
            profile: followUp.profile,
            matches: followUp.matches,
            profileSummary: [],
            followUpQuestions: [],
            detectedLanguage: followUp.lang,
            hasGoodMatches: followUp.matches.some(m => m.status === 'potentially_eligible'),
          };
          setCurrentProfile(followUp.profile);
          setCurrentMatches(followUp.matches);
        } else {
          // Contextual follow-up answer
          const narrative = buildFollowUpResponse(followUp, currentProfile, currentMatches, uiLang);
          setMessages(prev => prev.map(m =>
            m.id === loadingId ? { ...m, isLoading: false, text: narrative } : m
          ));
          setIsLoading(false);
          return;
        }
      } else {
        // New profile
        result = await processProfileInput(query, currentProfile);
        setCurrentProfile(result.profile);
        setCurrentMatches(result.matches);
        if (persistConsent) profileStorage.persist(result.profile);
      }

      const narrative = buildRecommendationNarrative(result, uiLang);
      const responseId = Date.now() + 2;

      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? {
              ...m,
              isLoading: false,
              text: narrative,
              result,
              responseId,
            }
          : m
      ));
    } catch (err) {
      console.error('Recommendation error:', err);
      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? { ...m, isLoading: false, text: 'An error occurred while processing your profile. Please try again.' }
          : m
      ));
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    profileStorage.clearAll();
    setCurrentProfile(null);
    setCurrentMatches([]);
    setMessages([{ id: 'welcome-reset', role: 'assistant', text: welcomeText[uiLang] || welcomeText.en }]);
  };

  const samples = SAMPLE_PROMPTS[uiLang] || SAMPLE_PROMPTS.en;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#075BA8]" />
          {uiLang === 'ta' ? 'திட்ட பரிந்துரை' : uiLang === 'hi' ? 'योजना अनुशंसा' : 'Personalised Scheme Advisor'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {uiLang === 'ta'
            ? 'உங்கள் சுயவிவரத்தின் அடிப்படையில் தகுதியான அரசு திட்டங்களை கண்டறியுங்கள்'
            : uiLang === 'hi'
            ? 'अपनी प्रोफ़ाइल के आधार पर सरकारी योजनाओं की जांच करें'
            : 'Find government schemes you may be eligible for, based on your profile'}
        </p>
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner lang={uiLang} />

      {/* Profile panel */}
      {currentProfile && (
        <div className="mt-3">
          <ProfileSummaryPanel profile={currentProfile} onClear={handleClear} lang={uiLang} />
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-1 min-h-0">
        {messages.map(msg => (
          <ChatBubble key={msg.id} role={msg.role} text={msg.text} isLoading={msg.isLoading}>
            {msg.result && (
              <div className="space-y-3 mt-2">
                {/* Follow-up questions */}
                {msg.result.followUpQuestions?.length > 0 && (
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {uiLang === 'ta' ? 'கூடுதல் தகவல்:' : uiLang === 'hi' ? 'और जानकारी के लिए:' : 'To refine recommendations, please answer:'}
                    </p>
                    <ul className="space-y-1">
                      {msg.result.followUpQuestions.map((q, i) => (
                        <li key={i}
                          className="text-xs text-amber-700 dark:text-amber-400 cursor-pointer hover:text-[#075BA8] transition-colors"
                          onClick={() => setInput(q)}
                        >
                          → {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scheme cards */}
                {msg.result.matches?.length > 0 && (
                  <div className="space-y-2">
                    {msg.result.matches.map((match, i) => {
                      const scheme = schemesData.find(s => s.id === match.schemeId);
                      return (
                        <SchemeRecommendationCard
                          key={match.schemeId}
                          match={match}
                          scheme={scheme}
                          lang={uiLang}
                          onSpeak={handleSpeakScheme}
                        />
                      );
                    })}
                  </div>
                )}

                {/* No matches */}
                {msg.result.matches?.length === 0 && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-600 dark:text-slate-400">
                    {uiLang === 'ta'
                      ? 'பொருந்தக்கூடிய திட்டங்கள் இல்லை. மேலும் தகவல்களை வழங்கவும்.'
                      : uiLang === 'hi'
                      ? 'कोई मेल खाने वाली योजना नहीं मिली। अधिक जानकारी दें।'
                      : 'No schemes matched your current profile. Please provide more details.'}
                  </div>
                )}
              </div>
            )}
          </ChatBubble>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Sample prompts (shown before first message) */}
      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {samples.slice(0, 2).map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSubmit(s)}
              className="text-left px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:border-[#075BA8] hover:text-[#075BA8] transition-all max-w-xs truncate"
              title={s}
            >
              {s.slice(0, 70)}...
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex gap-2 items-end bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-2 focus-within:border-[#075BA8] transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
            }}
            placeholder={
              uiLang === 'ta'
                ? 'உங்கள் சுயவிவரத்தை இங்கே தெரிவியுங்கள்...'
                : uiLang === 'hi'
                ? 'अपना विवरण यहाँ बताएं...'
                : 'Describe your profile naturally — age, location, income, occupation, family...'
            }
            rows={2}
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none leading-relaxed"
          />
          <div className="flex items-center gap-1 shrink-0 pb-0.5">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-2 rounded-xl transition-colors ${isListening ? 'text-red-500 bg-red-50 dark:bg-red-950/30 animate-pulse' : 'text-slate-400 hover:text-[#075BA8] hover:bg-[#EAF4FF] dark:hover:bg-blue-900/30'}`}
              title={isListening ? 'Stop listening' : 'Speak'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-[#075BA8] text-white hover:bg-[#064780] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Persist consent + clear */}
        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={persistConsent}
              onChange={e => {
                setPersistConsent(e.target.checked);
                if (!e.target.checked) localStorage.removeItem('janabridge_profile_v1');
              }}
              className="w-3 h-3 rounded accent-[#075BA8]"
            />
            {uiLang === 'ta'
              ? 'என் சுயவிவரத்தை சேமி (அடுத்த விஜயத்திற்கு)'
              : uiLang === 'hi'
              ? 'अगली बार के लिए प्रोफ़ाइल सहेजें'
              : 'Remember my profile for next visit'}
          </label>
          {currentProfile && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {uiLang === 'ta' ? 'மீட்டமை' : uiLang === 'hi' ? 'रीसेट करें' : 'Reset profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Follow-up response builder ────────────────────────────────
function buildFollowUpResponse(followUp, profile, matches, lang) {
  const { type, targetScheme } = followUp;
  const schemesMap = Object.fromEntries(schemesData.map(s => [s.id, s]));

  if (type === 'documents' && targetScheme) {
    const scheme = schemesMap[targetScheme.schemeId];
    if (!scheme) return 'Please expand a scheme card to see required documents.';
    const docs = lang === 'ta' ? (scheme.tamilRequiredDocuments || scheme.requiredDocuments) :
                 lang === 'hi' ? (scheme.hindiRequiredDocuments || scheme.requiredDocuments) :
                 scheme.requiredDocuments;
    if (lang === 'ta') return `${scheme.tamilName || scheme.name}-க்கு தேவையான ஆவணங்கள்:\n${(docs || []).map((d, i) => `${i + 1}. ${d}`).join('\n')}`;
    if (lang === 'hi') return `${scheme.hindiName || scheme.name} के लिए आवश्यक दस्तावेज:\n${(docs || []).map((d, i) => `${i + 1}. ${d}`).join('\n')}`;
    return `Required documents for ${scheme.name}:\n${(docs || []).map((d, i) => `${i + 1}. ${d}`).join('\n')}`;
  }

  if (type === 'apply' && targetScheme) {
    const scheme = schemesMap[targetScheme.schemeId];
    if (!scheme) return 'Please expand a scheme card to see application steps.';
    const steps = lang === 'ta' ? (scheme.tamilApplicationSteps || scheme.applicationSteps) :
                  lang === 'hi' ? (scheme.hindiApplicationSteps || scheme.applicationSteps) :
                  scheme.applicationSteps;
    if (lang === 'ta') return `${scheme.tamilName || scheme.name}-க்கு விண்ணப்பிக்கும் முறை:\n${(steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nஆதிகாரப்பூர்வ தளம்: ${scheme.officialSourceUrl}`;
    if (lang === 'hi') return `${scheme.hindiName || scheme.name} के लिए आवेदन प्रक्रिया:\n${(steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nआधिकारिक पोर्टल: ${scheme.officialSourceUrl}`;
    return `How to apply for ${scheme.name}:\n${(steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nOfficial portal: ${scheme.officialSourceUrl}`;
  }

  if (type === 'why' && targetScheme) {
    const matched = targetScheme.satisfiedCriteria?.map(c => c.label).join(', ') || 'profile criteria';
    if (lang === 'ta') return `${targetScheme.schemeName}-க்கு தகுதி இருக்கலாம்: ${matched} ஆகியவை பொருந்துகின்றன.`;
    if (lang === 'hi') return `${targetScheme.schemeName} के लिए संभावित पात्रता: ${matched} मापदंड पूरे होते हैं।`;
    return `${targetScheme.schemeName} appears relevant because: ${matched}.`;
  }

  if (lang === 'ta') return 'மேலதிக தகவல்களை வழங்கினால் சிறந்த பரிந்துரைகள் வழங்க இயலும்.';
  if (lang === 'hi') return 'अधिक विवरण देने पर बेहतर सिफारिशें मिलेंगी।';
  return 'Please provide more details or select a specific scheme from the results above to ask follow-up questions.';
}

export default RecommendationPage;
