/**
 * Language detector for JanaBridge.
 * Detects English, Tamil script, Hindi (Devanagari) script, and Tanglish (Tamil in Latin characters).
 */

const TAMIL_REGEX = /[\u0B80-\u0BFF]/;
const HINDI_REGEX = /[\u0900-\u097F]/;

const STRONG_TANGLISH_MARKERS = new Set([
  'epdi', 'eppadi', 'eppdi', 'panradhu', 'panrathu', 'pannunga', 'pannanum',
  'venum', 'edukuradhu', 'edukanum', 'mudiyuma', 'kedaikkum', 'kedaikuma',
  'vinnappam', 'saanrithal', 'sandrithal', 'saandrithal', 'vinnappippathu',
  'iruppida', 'saathi', 'muthiyor', 'oivu', 'oothiyam', 'aayiduchu',
  'solunga', 'sollunga', 'kudunga', 'seivathu', 'seiyanum'
]);

const TANGLISH_WORDS = new Set([
  ...STRONG_TANGLISH_MARKERS,
  'enna', 'engu', 'enga', 'eppo', 'yaar', 'yaaru', 'yaarukku', 'edhu', 'ethu',
  'panna', 'pannalam', 'ponga', 'vaanga', 'kudukka', 'edukka', 'eduthu',
  'paakanum', 'theriyum', 'theriyuma', 'therila', 'irukku', 'irukka', 'irundha',
  'aagum', 'aachu', 'thevai', 'thevaiya', 'vendam', 'vendaam',
  'enakku', 'unakku', 'ungalukku', 'ungallukku', 'avanga', 'avangalukku',
  'adhu', 'idhu', 'adhellam', 'idhellam', 'la', 'ku', 'oda', 'kooda', 'mattum',
  'nalla', 'romba', 'illai', 'illa', 'dhan', 'than', 'aprom', 'marubadiyum',
  'varumana', 'kudumba', 'attai', 'magalir', 'urimai', 'thogai', 'patta', 'chitta', 'esevai'
]);

const TANGLISH_SUFFIX_REGEX = /\b[a-zA-Z]+(panradhu|panrathu|pannunga|pannanum|pannalam|edukkurathu|edukuradhu|edukanum|venum|kaga|ku|la)\b/i;

/**
 * Detect language of input string.
 * @param {string} text
 * @param {string} fallback - 'english' | 'tanglish' | 'tamil' | 'hindi'
 * @returns {'english' | 'tanglish' | 'tamil' | 'hindi'}
 */
export function detectLanguage(text, fallback = 'english') {
  if (!text || typeof text !== 'string') return fallback;
  const clean = text.trim();
  if (!clean) return fallback;

  // 1. Tamil Unicode Script
  if (TAMIL_REGEX.test(clean)) {
    return 'tamil';
  }

  // 2. Hindi / Devanagari Unicode Script
  if (HINDI_REGEX.test(clean)) {
    return 'hindi';
  }

  // 3. Latin Characters: distinguish Tanglish vs English
  const words = clean.toLowerCase().match(/[a-zA-Z]+(?:-[a-zA-Z]+)?/g);
  if (!words || words.length === 0) return fallback;

  let strongHit = false;
  let matches = 0;

  for (const w of words) {
    if (STRONG_TANGLISH_MARKERS.has(w)) {
      strongHit = true;
      matches += 2;
    } else if (TANGLISH_WORDS.has(w)) {
      matches += 1;
    } else if (TANGLISH_SUFFIX_REGEX.test(w)) {
      strongHit = true;
      matches += 1;
    }
  }

  if (strongHit || matches >= 2) {
    return 'tanglish';
  }

  // Short sentence with 1 Tanglish marker (e.g., "CAN na enna?")
  if (words.length <= 4 && matches >= 1) {
    return 'tanglish';
  }

  return 'english';
}
