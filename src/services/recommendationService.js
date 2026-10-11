/**
 * recommendationService.js
 * Orchestrates profile extraction, eligibility matching, and result formatting
 * for the JanaBridge Personalized Scheme Recommendation feature.
 *
 * Privacy:
 *   - Profile stored ONLY in sessionStorage by default (transient)
 *   - Persisted to localStorage ONLY with explicit user consent
 *   - Never sends Aadhaar/PAN/bank identifiers to any API
 */

import { extractProfile, mergeProfiles, getMissingFields, summarizeProfile, createEmptyProfile } from '../utils/profileExtractor';
import { matchSchemes, generateFollowUpQuestions, evaluateScheme } from '../utils/eligibilityMatcher';
import { detectLanguage } from '../utils/languageDetector';
import schemesData from '../data/schemes.json';

const SESSION_KEY = 'janabridge_profile_session';
const PERSIST_KEY = 'janabridge_profile_v1';

// ────────────────────────────────────────────────────────────
//  Profile Storage (transient session by default)
// ────────────────────────────────────────────────────────────

export const profileStorage = {
  getSession: () => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  },
  saveSession: (profile) => {
    try {
      // Strip raw input before saving to avoid storing full text
      const safe = { ...profile, _rawInput: '[redacted]' };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    } catch { /* ignore quota errors */ }
  },
  loadPersisted: () => {
    try {
      const s = localStorage.getItem(PERSIST_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  },
  persist: (profile) => {
    try {
      const safe = { ...profile, _rawInput: '[redacted]' };
      localStorage.setItem(PERSIST_KEY, JSON.stringify(safe));
    } catch { /* ignore */ }
  },
  clearAll: () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
  },
};

// ────────────────────────────────────────────────────────────
//  Main service functions
// ────────────────────────────────────────────────────────────

/**
 * Process a citizen's natural-language profile input.
 * Returns extraction result, eligibility matches, follow-up questions.
 *
 * @param {string} input - Free-text citizen profile
 * @param {Object} [existingProfile] - Previous profile to merge with
 * @returns {RecommendationResult}
 */
export async function processProfileInput(input, existingProfile = null) {
  // 1. Detect language
  const detectedLang = detectLanguage(input, 'english');
  const uiLang = detectedLang === 'tamil' ? 'ta' : detectedLang === 'hindi' ? 'hi' : 'en';

  // 2. Extract profile from text
  const freshProfile = extractProfile(input);

  // 3. Merge with any existing profile session
  const mergedProfile = existingProfile
    ? mergeProfiles(existingProfile, freshProfile)
    : freshProfile;

  // 4. Save to session
  profileStorage.saveSession(mergedProfile);

  // 5. Run deterministic eligibility matching
  const matches = matchSchemes(schemesData, mergedProfile, { showAll: false });

  // 6. Identify missing fields
  const missingFields = getMissingFields(mergedProfile);

  // 7. Generate follow-up questions
  const followUpQuestions = generateFollowUpQuestions(mergedProfile, matches.slice(0, 5), uiLang);

  // 8. Profile summary lines
  const profileSummary = summarizeProfile(mergedProfile, uiLang);

  // 9. Format results
  const topMatches = matches
    .filter(r => r.status === 'potentially_eligible' || r.status === 'needs_more_info')
    .slice(0, 8);

  const hasGoodMatches = topMatches.some(r => r.status === 'potentially_eligible');

  return {
    profile: mergedProfile,
    profileSummary,
    missingFields,
    matches: topMatches,
    allMatches: matches,
    followUpQuestions,
    detectedLanguage: detectedLang,
    hasGoodMatches,
    disclaimer: 'These are preliminary recommendations based on your stated profile. Official authorities determine final eligibility. Always verify directly with the relevant government department.',
  };
}

/**
 * Process follow-up query in context of existing profile and recommendations.
 * Handles questions like "Why am I eligible for PM-KISAN?" or "What documents do I need?"
 */
export async function processFollowUp(query, existingProfile, existingMatches) {
  const lower = query.toLowerCase().trim();
  const lang = detectLanguage(query, 'english');

  // Detect follow-up intent
  let targetScheme = null;

  // "second scheme", "first one", "scheme 2"
  const ordinalMatch = lower.match(/\b(first|second|third|1st|2nd|3rd|1|2|3)\b/);
  if (ordinalMatch && existingMatches?.length > 0) {
    const ordinalMap = { first: 0, '1st': 0, '1': 0, second: 1, '2nd': 1, '2': 1, third: 2, '3rd': 2, '3': 2 };
    const idx = ordinalMap[ordinalMatch[1]];
    if (idx !== undefined) targetScheme = existingMatches[idx];
  }

  // Scheme name mention
  if (!targetScheme && existingMatches) {
    for (const match of existingMatches) {
      const nameLower = match.schemeName?.toLowerCase() || '';
      const shortName = nameLower.split(' ').slice(0, 3).join(' ');
      if (lower.includes(shortName) || (match.scheme?.id && lower.includes(match.scheme.id))) {
        targetScheme = match;
        break;
      }
    }
  }

  // Intent detection
  const isDocQuestion = /\b(document|docs?|certificate|proof|papers?|aadhaar|required)\b/i.test(query);
  const isApplyQuestion = /\b(apply|appl(?:ication|y)|how\s+to|process|steps?|procedure)\b/i.test(query);
  const isWhyQuestion = /\b(why|reason|because|explain|eligible|criteria|qualify)\b/i.test(query);
  const isWhatIfQuestion = /\b(what\s+if|suppose|if\s+(?:my|i)|scenario)\b/i.test(query);

  // Hypothetical income change
  let updatedProfile = existingProfile;
  if (isWhatIfQuestion) {
    const newIncome = extractAmountFromQuery(query);
    if (newIncome !== null) {
      updatedProfile = {
        ...existingProfile,
        annualIncome: { value: newIncome, source: 'confirmed' },
      };
      const newMatches = matchSchemes(schemesData, updatedProfile, { showAll: false });
      return {
        type: 'hypothetical',
        profile: updatedProfile,
        matches: newMatches.filter(r => r.status === 'potentially_eligible' || r.status === 'needs_more_info').slice(0, 8),
        query,
        lang,
      };
    }
  }

  // New profile info in follow-up (additional facts)
  const additionalProfile = extractProfile(query);
  const hasNewInfo = getMissingFields(existingProfile).some(f => additionalProfile[f]?.source === 'provided');
  if (hasNewInfo) {
    return processProfileInput(query, existingProfile);
  }

  return {
    type: isDocQuestion ? 'documents' : isApplyQuestion ? 'apply' : isWhyQuestion ? 'why' : 'general',
    targetScheme,
    query,
    lang,
    profile: existingProfile,
    matches: existingMatches,
  };
}

function extractAmountFromQuery(text) {
  const m = text.match(/([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|thousand)?/i);
  if (!m) return null;
  let val = parseFloat(m[1].replace(/,/g, ''));
  if (/lakh|lac/.test(m[2] || '')) val *= 100000;
  else if (/crore/.test(m[2] || '')) val *= 10000000;
  else if (/thousand/.test(m[2] || '')) val *= 1000;
  return isNaN(val) ? null : val;
}

/**
 * Format a single scheme match result for display.
 * Returns language-aware text.
 */
export function formatMatchResult(match, scheme, lang = 'en') {
  if (!match || !scheme) return null;

  const statusLabels = {
    en: {
      potentially_eligible: '✅ Potentially Eligible',
      needs_more_info: '🔍 Needs More Information',
      not_eligible: '❌ Does Not Appear Eligible',
      unable_to_verify: '⚠️ Unable to Verify',
    },
    ta: {
      potentially_eligible: '✅ தகுதியாக இருக்கலாம்',
      needs_more_info: '🔍 கூடுதல் தகவல் தேவை',
      not_eligible: '❌ தகுதியற்றவர்',
      unable_to_verify: '⚠️ சரிபார்க்க இயலவில்லை',
    },
    hi: {
      potentially_eligible: '✅ संभावित रूप से पात्र',
      needs_more_info: '🔍 और जानकारी आवश्यक',
      not_eligible: '❌ पात्र नहीं लगते',
      unable_to_verify: '⚠️ सत्यापित नहीं हो सका',
    },
  };

  const labels = statusLabels[lang] || statusLabels.en;
  const name = lang === 'ta' ? (scheme.tamilName || scheme.name) : lang === 'hi' ? (scheme.hindiName || scheme.name) : scheme.name;
  const benefits = lang === 'ta' ? (scheme.tamilBenefits || scheme.benefits) : lang === 'hi' ? (scheme.hindiBenefits || scheme.benefits) : scheme.benefits;
  const docs = lang === 'ta' ? (scheme.tamilRequiredDocuments || scheme.requiredDocuments) : lang === 'hi' ? (scheme.hindiRequiredDocuments || scheme.requiredDocuments) : scheme.requiredDocuments;
  const steps = lang === 'ta' ? (scheme.tamilApplicationSteps || scheme.applicationSteps) : lang === 'hi' ? (scheme.hindiApplicationSteps || scheme.applicationSteps) : scheme.applicationSteps;

  return {
    statusLabel: labels[match.status],
    schemeName: name,
    summary: match.summary,
    satisfiedCriteria: match.satisfiedCriteria,
    failedCriteria: match.failedCriteria,
    unknownCriteria: match.unknownCriteria,
    benefits: benefits || [],
    requiredDocuments: docs || [],
    applicationSteps: steps || [],
    officialSourceUrl: scheme.officialSourceUrl,
    lastVerifiedAt: scheme.lastVerifiedAt,
    verificationStatus: scheme.verificationStatus,
    confidenceScore: match.confidenceScore,
  };
}

/**
 * Build a natural-language summary of recommendations for a given language.
 */
export function buildRecommendationNarrative(result, lang = 'en') {
  const { matches, profileSummary, followUpQuestions, hasGoodMatches } = result;

  if (!hasGoodMatches && matches.length === 0) {
    if (lang === 'ta') {
      return 'உங்கள் சுயவிவரத்தின் அடிப்படையில் பொருந்தக்கூடிய திட்டங்கள் இல்லை. கூடுதல் தகவல்களை வழங்கினால் சிறந்த பலன் கிடைக்கும்.';
    } else if (lang === 'hi') {
      return 'आपकी प्रोफ़ाइल के आधार पर कोई मेल खाने वाली योजना नहीं मिली। अधिक जानकारी देने पर बेहतर परिणाम मिल सकते हैं।';
    }
    return 'No matching schemes found based on your profile. Providing more details may surface better recommendations.';
  }

  const eligible = matches.filter(r => r.status === 'potentially_eligible');
  const needsInfo = matches.filter(r => r.status === 'needs_more_info');

  if (lang === 'ta') {
    let text = '';
    if (eligible.length > 0) text += `${eligible.length} திட்டங்களில் தகுதி பெறுவதற்கான சாத்தியம் உள்ளது. `;
    if (needsInfo.length > 0) text += `${needsInfo.length} திட்டங்களுக்கு கூடுதல் தகவல் தேவை.`;
    return text;
  } else if (lang === 'hi') {
    let text = '';
    if (eligible.length > 0) text += `${eligible.length} योजनाओं में संभावित रूप से पात्र हैं। `;
    if (needsInfo.length > 0) text += `${needsInfo.length} योजनाओं के लिए अधिक जानकारी आवश्यक है।`;
    return text;
  }

  let text = '';
  if (eligible.length > 0) text += `Potentially eligible for ${eligible.length} scheme(s). `;
  if (needsInfo.length > 0) text += `${needsInfo.length} scheme(s) need more information to assess eligibility.`;
  return text;
}
