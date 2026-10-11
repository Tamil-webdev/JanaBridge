/**
 * profileExtractor.js
 * Deterministic natural-language profile extractor for JanaBridge.
 * Parses citizen profile fields from free-text input in English, Tamil,
 * Tanglish, and Hindi. Does NOT call any LLM — all logic is rule-based.
 *
 * Privacy: never extracts Aadhaar/PAN/bank numbers.
 */

// ────────────────────────────────────────────────────────────
//  Helpers
// ────────────────────────────────────────────────────────────

/**
 * Resolve a numeric string with Indian number words to a float.
 * e.g. "1.8 lakh" → 180000, "2 crore" → 20000000
 */
function resolveAmount(raw) {
  if (!raw) return null;
  const s = String(raw).toLowerCase().replace(/,/g, '').trim();
  const numMatch = s.match(/([\d.]+)/);
  if (!numMatch) return null;
  let val = parseFloat(numMatch[1]);
  if (isNaN(val)) return null;
  if (/crore|kodi/.test(s)) val *= 1_00_00_000;
  else if (/lakh|lakhs|lac|lacs/.test(s)) val *= 1_00_000;
  else if (/thousand|hajar|ஆயிரம்/.test(s)) val *= 1_000;
  return val;
}

/**
 * Extract first matching number+unit combo from text.
 */
function extractAmount(text) {
  // ₹ or Rs prefix or suffix "per year / pa / annual"
  const patterns = [
    /₹\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|thousand|k)?/i,
    /rs\.?\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|thousand|k)?/i,
    /([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|thousand|k)?\s*(?:rupees?|rs\.?|₹)/i,
    /income[^₹\d]*([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|thousand|k)?/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return resolveAmount((m[1] || '') + ' ' + (m[2] || ''));
  }
  return null;
}

// ────────────────────────────────────────────────────────────
//  Field extractors
// ────────────────────────────────────────────────────────────

function extractAge(text) {
  // "35 years old", "age 35", "வயது 35", "35 saal", "aged 35"
  const patterns = [
    /(?:i am|i'm|am)\s+(\d{1,3})\s+(?:years?\s*old|yrs?\s*old)/i,
    /age[d]?\s*(?:is|:)?\s*(\d{1,3})/i,
    /(\d{1,3})\s+years?\s*(?:old|of age)/i,
    /(\d{1,3})\s*(?:வயது|வயதுள்ள|வயதான)/i,
    /(\d{1,3})\s*saal/i,
    /(\d{1,3})\s*वर्ष/i,
    /(\d{1,3})\s*साल/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const age = parseInt(m[1], 10);
      if (age >= 0 && age <= 120) return age;
    }
  }
  return null;
}

function extractState(text) {
  const stateMap = {
    'tamil nadu': 'tamil-nadu',
    'tamilnadu': 'tamil-nadu',
    'தமிழ்நாடு': 'tamil-nadu',
    'tn': 'tamil-nadu',
    'telangana': 'telangana',
    'andhra': 'andhra-pradesh',
    'andhra pradesh': 'andhra-pradesh',
    'kerala': 'kerala',
    'karnataka': 'karnataka',
    'maharashtra': 'maharashtra',
    'rajasthan': 'rajasthan',
    'uttar pradesh': 'uttar-pradesh',
    'up': 'uttar-pradesh',
    'bihar': 'bihar',
    'west bengal': 'west-bengal',
    'gujarat': 'gujarat',
    'madhya pradesh': 'madhya-pradesh',
    'mp': 'madhya-pradesh',
    'punjab': 'punjab',
    'haryana': 'haryana',
    'odisha': 'odisha',
    'jharkhand': 'jharkhand',
    'assam': 'assam',
    'chhattisgarh': 'chhattisgarh',
  };
  const lower = text.toLowerCase();
  // Longest match first
  const sorted = Object.keys(stateMap).sort((a, b) => b.length - a.length);
  for (const key of sorted) {
    if (lower.includes(key)) return stateMap[key];
  }
  return null;
}

function extractResidenceType(text) {
  const lower = text.toLowerCase();
  const ruralPatterns = /\b(rural|village|gram|kiraama|கிராம|गांव|gramin|panchayat)\b/i;
  const urbanPatterns = /\b(urban|city|town|nagar|நகர|शहर|municipal|ward)\b/i;
  if (ruralPatterns.test(lower)) return 'rural';
  if (urbanPatterns.test(lower)) return 'urban';
  return null;
}

function extractIncome(text) {
  // annual income
  const lowerText = text.toLowerCase();

  // Direct annual income
  const annualPatterns = [
    /annual(?:\s+(?:household|family))?\s+income[^₹\d\n]*([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|thousand|k)?/i,
    /earn(?:ing|s)?\s+(?:around|about|approximately)?\s*₹\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|thousand|k)?(?:\s+(?:per\s+year|pa|annually|a\s+year))?/i,
    /(?:per\s+year|annually|yearly|p\.a\.?)\s*[₹\s]*([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|thousand|k)?/i,
    /income\s+(?:is|of|around|about)?\s*₹?\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|thousand|k)?/i,
  ];
  for (const re of annualPatterns) {
    const m = text.match(re);
    if (m) {
      const val = resolveAmount((m[1] || '') + ' ' + (m[2] || ''));
      if (val !== null) return val;
    }
  }

  // Fallback generic amount
  return extractAmount(text);
}

function extractOccupation(text) {
  const occupations = [
    // Agricultural
    { pattern: /\b(agricultural?\s+labourer?|farm\s+work(?:er)?|cultivat(?:or|ing)|farmer|kisan|vivasayi|விவசாயி|किसान)\b/i, value: 'agricultural-labourer', category: 'agriculture' },
    { pattern: /\b(self[\s-]?employ(?:ed)?|small\s+business|trader|merchant|shopkeeper|dukan)\b/i, value: 'self-employed', category: 'business' },
    { pattern: /\b(daily[\s-]?wage|casual\s+worker|unskilled\s+worker|coolie|kuli)\b/i, value: 'daily-wage', category: 'labour' },
    { pattern: /\b(government\s+(?:employee|servant|officer|worker)|sarkari\s+naukri)\b/i, value: 'govt-employee', category: 'government' },
    { pattern: /\b(private\s+(?:company|sector|employee|job)|it\s+(?:sector|company|job)|software\s+engineer)\b/i, value: 'private-employee', category: 'private' },
    { pattern: /\b(student|studying|padikiren|படிக்கிறேன்|पढ़|college|school)\b/i, value: 'student', category: 'student' },
    { pattern: /\b(housewife|homemaker|house\s*wife|kudumba\s+pen|குடும்பப்\s*பெண்)\b/i, value: 'homemaker', category: 'homemaker' },
    { pattern: /\b(fisherma[nm]|fishing|meen\s+pidikiren|மீனவர்)\b/i, value: 'fisherman', category: 'agriculture' },
    { pattern: /\b(weaver|handloom|neyalar|நெசவாளர்)\b/i, value: 'weaver', category: 'artisan' },
    { pattern: /\b(construction\s+worker|mason|கட்டுமான|निर्माण)\b/i, value: 'construction-worker', category: 'labour' },
    { pattern: /\b(teacher|professor|teaching)\b/i, value: 'teacher', category: 'government' },
    { pattern: /\b(unemployed|no\s+job|no\s+work|jobless|வேலையில்லா)\b/i, value: 'unemployed', category: 'unemployed' },
  ];
  for (const occ of occupations) {
    if (occ.pattern.test(text)) return { value: occ.value, category: occ.category };
  }
  return null;
}

function extractGender(text) {
  const lower = text.toLowerCase();
  if (/\b(she|her|woman|women|girl|female|lady|ladies|மகளிர்|பெண்|महिला|औरत)\b/.test(lower)) return 'female';
  if (/\b(he|his|man|men|male|boy|sir|mr|ஆண்|पुरुष|आदमी)\b/.test(lower)) return 'male';
  return null;
}

function extractLandholding(text) {
  // e.g. "1 acre of dry land", "2 hectares wetland", "0.5 acre nanjei"
  const acrePatterns = [
    /(\d+(?:\.\d+)?)\s*acres?\s+(?:of\s+)?(dry|wet|nanjei|punjei|agricultural|irrigated|unirrigated|farm)?/i,
    /(\d+(?:\.\d+)?)\s*hecatres?\s+(?:of\s+)?(dry|wet|irrigated|agricultural)?/i,
    /([\d.]+)\s*ஏக்கர்/i,
    /([\d.]+)\s*एकड़/i,
  ];

  let wetland = null;
  let dryland = null;
  let total = null;

  const totalMatch = text.match(/(\d+(?:\.\d+)?)\s*acres?\s+(?:of\s+)?(?:land|dry\s+land|wet\s+land|agricultural)/i);
  if (totalMatch) total = parseFloat(totalMatch[1]);

  const wetMatch = text.match(/(\d+(?:\.\d+)?)\s*acres?\s+(?:of\s+)?(?:wet(?:land)?|nanjei|irrigated)/i);
  if (wetMatch) wetland = parseFloat(wetMatch[1]);

  const dryMatch = text.match(/(\d+(?:\.\d+)?)\s*acres?\s+(?:of\s+)?(?:dry(?:land)?|punjei|unirrigated)/i);
  if (dryMatch) dryland = parseFloat(dryMatch[1]);

  if (wetland === null && dryland === null && total !== null) {
    // If just "N acres" with no qualifier, assume dryland (more conservative for eligibility)
    dryland = total;
  }

  if (wetland !== null || dryland !== null) {
    return { wetland, dryland, total: total || (wetland || 0) + (dryland || 0) };
  }
  return null;
}

function extractSocialCategory(text) {
  const lower = text.toLowerCase();
  // Only extract if explicitly mentioned
  if (/\b(sc|scheduled\s+caste|dalit|harijan|ஆதிதிராவிடர்|अनुसूचित\s*जाति)\b/.test(lower)) return 'SC';
  if (/\b(st|scheduled\s+tribe|tribe|adivasi|பழங்குடியினர்|अनुसूचित\s*जनजाति)\b/.test(lower)) return 'ST';
  if (/\b(mbc|most\s+backward\s+class|denotified)\b/.test(lower)) return 'MBC';
  if (/\b(obc|other\s+backward|bc|backward\s+class|பிற்படுத்தப்பட்ட)\b/.test(lower)) return 'OBC';
  if (/\b(general|open\s+category|forward\s+class|oc)\b/.test(lower)) return 'General';
  return null;
}

function extractDisabilityStatus(text) {
  const lower = text.toLowerCase();
  if (/\b(disability|disabled|differently\s+abled|handicap|visually\s+impaired|blind|deaf|முற்றிலும்\s+குறைபாடு|divyang|विकलांग)\b/.test(lower)) return true;
  return null;
}

function extractStudentStatus(text) {
  const lower = text.toLowerCase();
  const isStudent = /\b(student|studying|studying in|enrolled in|padikiren|படிக்கிறேன்|पढ़ रहा|college|university|school)\b/.test(lower);
  if (!isStudent) return null;

  let courseType = null;
  if (/\b(ug|undergrad|bachelor|be|btech|ba|bsc|bcom|mbbs|bds)\b/.test(lower)) courseType = 'undergraduate';
  else if (/\b(pg|postgrad|master|mtech|ma|msc|mcom|phd)\b/.test(lower)) courseType = 'postgraduate';
  else if (/\b(diploma|polytechnic|iti|vocational)\b/.test(lower)) courseType = 'diploma';

  let schoolType = null;
  if (/\b(government\s+school|govt\s+school|government-aided|aided\s+school|அரசுப்\s*பள்ளி)\b/.test(lower)) schoolType = 'government';
  else if (/\b(private\s+school|cbse|matriculation|mat\s+school)\b/.test(lower)) schoolType = 'private';

  return { isStudent: true, courseType, schoolType };
}

function extractMaritalStatus(text) {
  const lower = text.toLowerCase();
  if (/\b(married|spouse|husband|wife|திருமணமானவர்|विवाहित)\b/.test(lower)) return 'married';
  if (/\b(unmarried|single|bachelor|bachelorette|திருமணமாகாதவர்|अविवाहित)\b/.test(lower)) return 'unmarried';
  if (/\b(widow|widower|கைம்பெண்|विधवा)\b/.test(lower)) return 'widowed';
  if (/\b(divorced|separated|பிரிந்த|तलाकशुदा)\b/.test(lower)) return 'divorced';
  return null;
}

function extractChildren(text) {
  const m = text.match(/(\d+)\s+(?:child(?:ren)?|kids?|son|daughter|குழந்தை|बच्चे)/i);
  if (m) return parseInt(m[1], 10);
  if (/\b(no\s+children|childless)\b/i.test(text)) return 0;
  return null;
}

function extractName(text) {
  // "My name is X", "I am X", "call me X"
  const m = text.match(/(?:my\s+name\s+is|i\s+am|call\s+me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (m) return m[1];
  const tamM = text.match(/(?:என்\s+பெயர்|பெயர்)\s+([^\s,।।.]+)/i);
  if (tamM) return tamM[1];
  return null;
}

function extractHousingStatus(text) {
  const lower = text.toLowerCase();
  if (/\b(no\s+house|homeless|kutcha\s+house|kuccha|temporary\s+shelter|குடிசை|jhuggi)\b/.test(lower)) return 'kutcha';
  if (/\b(own\s+(?:a\s+)?(?:house|home|property)|pucca\s+house|concrete\s+house)\b/.test(lower)) return 'pucca-owner';
  if (/\b(rented?|tenant|rent)\b/.test(lower)) return 'rented';
  return null;
}

// ────────────────────────────────────────────────────────────
//  Main extractor
// ────────────────────────────────────────────────────────────

/**
 * Extract a structured CitizenProfile from natural-language text.
 * Each field has a `value` and a `source` ('provided' | 'unknown').
 *
 * @param {string} text - Free-text profile description
 * @returns {CitizenProfile}
 */
export function extractProfile(text) {
  if (!text || typeof text !== 'string') {
    return createEmptyProfile();
  }

  const make = (value) => ({
    value: value !== null && value !== undefined ? value : null,
    source: value !== null && value !== undefined ? 'provided' : 'unknown',
  });

  const name = extractName(text);
  const age = extractAge(text);
  const state = extractState(text);
  const residenceType = extractResidenceType(text);
  const annualIncome = extractIncome(text);
  const occupation = extractOccupation(text);
  const gender = extractGender(text);
  const landholding = extractLandholding(text);
  const socialCategory = extractSocialCategory(text);
  const disabilityStatus = extractDisabilityStatus(text);
  const studentStatus = extractStudentStatus(text);
  const maritalStatus = extractMaritalStatus(text);
  const numberOfChildren = extractChildren(text);
  const housingStatus = extractHousingStatus(text);

  return {
    name: make(name),
    age: make(age),
    state: make(state),
    residenceType: make(residenceType),
    annualIncome: make(annualIncome),
    occupation: make(occupation),
    gender: make(gender),
    landholding: make(landholding),
    socialCategory: make(socialCategory),
    disabilityStatus: make(disabilityStatus),
    studentStatus: make(studentStatus),
    maritalStatus: make(maritalStatus),
    numberOfChildren: make(numberOfChildren),
    housingStatus: make(housingStatus),
    _rawInput: text,
    _extractedAt: new Date().toISOString(),
  };
}

export function createEmptyProfile() {
  const unknown = { value: null, source: 'unknown' };
  return {
    name: unknown,
    age: unknown,
    state: unknown,
    residenceType: unknown,
    annualIncome: unknown,
    occupation: unknown,
    gender: unknown,
    landholding: unknown,
    socialCategory: unknown,
    disabilityStatus: unknown,
    studentStatus: unknown,
    maritalStatus: unknown,
    numberOfChildren: unknown,
    housingStatus: unknown,
    _rawInput: '',
    _extractedAt: null,
  };
}

/**
 * Merge two profiles (user corrections override extracted values).
 */
export function mergeProfiles(base, overrides) {
  const result = { ...base };
  for (const key of Object.keys(overrides)) {
    if (key.startsWith('_')) continue;
    if (overrides[key]?.source === 'provided' || overrides[key]?.source === 'confirmed') {
      result[key] = { ...overrides[key] };
    }
  }
  return result;
}

/**
 * Return list of important unknown fields for follow-up questions.
 */
export function getMissingFields(profile) {
  const important = ['age', 'state', 'annualIncome', 'occupation', 'residenceType'];
  return important.filter(f => profile[f]?.source === 'unknown' || profile[f]?.value === null);
}

/**
 * Format profile for display (does NOT include sensitive identifiers).
 */
export function summarizeProfile(profile, lang = 'en') {
  if (!profile) return [];
  const lines = [];
  if (profile.name?.value) lines.push(`Name: ${profile.name.value}`);
  if (profile.age?.value !== null && profile.age?.value !== undefined) lines.push(`Age: ${profile.age.value}`);
  if (profile.gender?.value) lines.push(`Gender: ${profile.gender.value}`);
  if (profile.state?.value) {
    const stStr = String(profile.state.value);
    lines.push(`State: ${stStr.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`);
  }
  if (profile.residenceType?.value) lines.push(`Residence: ${profile.residenceType.value}`);
  if (profile.annualIncome?.value !== null && profile.annualIncome?.value !== undefined) {
    lines.push(`Annual Income: ₹${Number(profile.annualIncome.value).toLocaleString('en-IN')}`);
  }
  if (profile.occupation?.value) {
    const rawOcc = profile.occupation.value;
    const occStr = typeof rawOcc === 'object' && rawOcc !== null ? (rawOcc.value || rawOcc.title || '') : String(rawOcc);
    if (occStr) lines.push(`Occupation: ${occStr.replace(/-/g, ' ')}`);
  }
  if (profile.landholding?.value) {
    const lh = profile.landholding.value;
    const parts = [];
    if (lh.wetland !== null && lh.wetland !== undefined) parts.push(`${lh.wetland} ac wetland`);
    if (lh.dryland !== null && lh.dryland !== undefined) parts.push(`${lh.dryland} ac dryland`);
    if (parts.length === 0 && lh.total !== null && lh.total !== undefined) parts.push(`${lh.total} ac`);
    if (parts.length > 0) lines.push(`Landholding: ${parts.join(', ')}`);
  }
  if (profile.socialCategory?.value) lines.push(`Category: ${profile.socialCategory.value}`);
  if (profile.maritalStatus?.value) lines.push(`Marital: ${profile.maritalStatus.value}`);
  if (profile.numberOfChildren?.value !== null && profile.numberOfChildren?.value !== undefined) {
    lines.push(`Children: ${profile.numberOfChildren.value}`);
  }
  if (profile.housingStatus?.value) lines.push(`Housing: ${profile.housingStatus.value}`);
  return lines;
}

