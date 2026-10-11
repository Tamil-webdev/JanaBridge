/**
 * eligibilityMatcher.js
 * Deterministic eligibility matching for JanaBridge Personalized Scheme Recommendations.
 *
 * For each scheme in the catalogue:
 *   - Evaluates structured eligibility rules against the citizen profile
 *   - Returns a status: 'potentially_eligible' | 'needs_more_info' | 'not_eligible' | 'unable_to_verify'
 *   - Lists satisfied criteria, failed criteria, and unknown criteria
 *
 * IMPORTANT: This engine uses deterministic rules only.
 * The LLM is NOT used to make eligibility decisions.
 */

// ────────────────────────────────────────────────────────────
//  Scheme eligibility rules catalogue
//  Each rule is a function: (profile) => { result, reason }
//  result: 'pass' | 'fail' | 'unknown'
// ────────────────────────────────────────────────────────────

/**
 * Returns true if two numbers are within tolerance.
 */
function approxEqual(a, b, tol = 1000) {
  return Math.abs(a - b) <= tol;
}

// Known eligibility rule evaluators keyed by scheme ID
const SCHEME_RULES = {

  'pm-kisan': [
    {
      id: 'landowner',
      label: 'Landholding farmer',
      mandatory: true,
      evaluate: (profile) => {
        const occ = profile.occupation?.value;
        const land = profile.landholding?.value;
        if (!occ && !land) return { result: 'unknown', reason: 'Occupation and landholding not specified' };
        const isAgriculture = occ?.category === 'agriculture' || occ?.value === 'agricultural-labourer';
        const hasLand = land && (land.wetland > 0 || land.dryland > 0);
        if (isAgriculture && hasLand) return { result: 'pass', reason: `Agricultural occupation with ${land.total} acres` };
        if (isAgriculture && !land) return { result: 'unknown', reason: 'Land ownership not confirmed' };
        if (!isAgriculture) return { result: 'fail', reason: 'Occupation does not appear agricultural' };
        return { result: 'unknown', reason: 'Landholding details needed' };
      }
    },
    {
      id: 'not-income-taxpayer',
      label: 'Not an income tax payer',
      mandatory: true,
      evaluate: (profile) => {
        const income = profile.annualIncome?.value;
        // Indian income tax threshold ≈ ₹3,00,000 (basic exemption)
        if (income === null) return { result: 'unknown', reason: 'Income not provided' };
        if (income < 300000) return { result: 'pass', reason: `Income ₹${income.toLocaleString('en-IN')} likely below tax threshold` };
        return { result: 'unknown', reason: 'Income above basic exemption — verify tax status' };
      }
    },
    {
      id: 'not-govt-employee',
      label: 'Not a government employee',
      mandatory: true,
      evaluate: (profile) => {
        const occ = profile.occupation?.value;
        const occVal = typeof occ === 'object' && occ !== null ? occ?.value : occ;
        if (!occVal) return { result: 'unknown', reason: 'Occupation not specified' };
        if (occVal === 'govt-employee') return { result: 'fail', reason: 'Government employees are excluded' };
        return { result: 'pass', reason: 'Not identified as a government employee' };
      }
    },
  ],

  'magalir-urimai-thogai': [
    {
      id: 'female',
      label: 'Female head of household',
      mandatory: true,
      evaluate: (profile) => {
        const gender = profile.gender?.value;
        if (!gender) return { result: 'unknown', reason: 'Gender not specified' };
        return gender === 'female'
          ? { result: 'pass', reason: 'Identified as female' }
          : { result: 'fail', reason: 'Scheme is exclusively for women' };
      }
    },
    {
      id: 'min-age-21',
      label: 'Age ≥ 21 years',
      mandatory: true,
      evaluate: (profile) => {
        const age = profile.age?.value;
        if (age === null) return { result: 'unknown', reason: 'Age not provided' };
        return age >= 21
          ? { result: 'pass', reason: `Age ${age} meets minimum 21 years` }
          : { result: 'fail', reason: `Age ${age} is below minimum 21 years` };
      }
    },
    {
      id: 'income-below-2.5L',
      label: 'Annual family income < ₹2,50,000',
      mandatory: true,
      evaluate: (profile) => {
        const income = profile.annualIncome?.value;
        if (income === null) return { result: 'unknown', reason: 'Income not provided' };
        if (income < 250000) return { result: 'pass', reason: `Income ₹${income.toLocaleString('en-IN')} is below ₹2,50,000` };
        return { result: 'fail', reason: `Income ₹${income.toLocaleString('en-IN')} exceeds ₹2,50,000 limit` };
      }
    },
    {
      id: 'land-below-10ac',
      label: 'Landholding ≤ 5 ac wetland or ≤ 10 ac dryland',
      mandatory: true,
      evaluate: (profile) => {
        const lh = profile.landholding?.value;
        if (!lh) return { result: 'unknown', reason: 'Landholding not specified' };
        const wetOk = lh.wetland === null || lh.wetland <= 5;
        const dryOk = lh.dryland === null || lh.dryland <= 10;
        if (wetOk && dryOk) return { result: 'pass', reason: `Landholding within limits` };
        if (!wetOk) return { result: 'fail', reason: `Wetland ${lh.wetland} ac exceeds 5 ac limit` };
        return { result: 'fail', reason: `Dryland ${lh.dryland} ac exceeds 10 ac limit` };
      }
    },
    {
      id: 'tamil-nadu-resident',
      label: 'Resident of Tamil Nadu',
      mandatory: true,
      evaluate: (profile) => {
        const state = profile.state?.value;
        if (!state) return { result: 'unknown', reason: 'State not provided' };
        return state === 'tamil-nadu'
          ? { result: 'pass', reason: 'Resident of Tamil Nadu' }
          : { result: 'fail', reason: `Scheme is only for Tamil Nadu residents (state: ${state})` };
      }
    },
  ],

  'pudhumai-penn-scheme': [
    {
      id: 'female',
      label: 'Female student',
      mandatory: true,
      evaluate: (profile) => {
        const gender = profile.gender?.value;
        if (!gender) return { result: 'unknown', reason: 'Gender not specified' };
        return gender === 'female'
          ? { result: 'pass', reason: 'Identified as female' }
          : { result: 'fail', reason: 'Scheme is for female students only' };
      }
    },
    {
      id: 'higher-education',
      label: 'Enrolled in undergraduate/diploma/ITI',
      mandatory: true,
      evaluate: (profile) => {
        const st = profile.studentStatus?.value;
        if (!st) return { result: 'unknown', reason: 'Student status not specified' };
        const eligibleTypes = ['undergraduate', 'diploma', null]; // null = type not specified but student
        if (st.isStudent && (eligibleTypes.includes(st.courseType) || st.courseType !== 'school')) {
          return { result: 'pass', reason: `Student enrolled in ${st.courseType || 'higher education'}` };
        }
        return { result: 'unknown', reason: 'Confirm course type (UG/Diploma/ITI)' };
      }
    },
    {
      id: 'govt-school',
      label: 'Studied in TN government school (Class 6–12)',
      mandatory: true,
      evaluate: (profile) => {
        const st = profile.studentStatus?.value;
        if (!st) return { result: 'unknown', reason: 'School background not specified' };
        if (st.schoolType === 'government') return { result: 'pass', reason: 'Government school background confirmed' };
        if (st.schoolType === 'private') return { result: 'fail', reason: 'Private school background — must have studied in TN government school' };
        return { result: 'unknown', reason: 'Please confirm: Did you study in a Tamil Nadu government school from Class 6 to 12?' };
      }
    },
    {
      id: 'tamil-nadu-resident',
      label: 'Enrolled in Tamil Nadu college',
      mandatory: true,
      evaluate: (profile) => {
        const state = profile.state?.value;
        if (!state) return { result: 'unknown', reason: 'State not provided' };
        return state === 'tamil-nadu'
          ? { result: 'pass', reason: 'Tamil Nadu resident/student' }
          : { result: 'fail', reason: 'Scheme is for Tamil Nadu only' };
      }
    },
  ],

  'cmchis-tn': [
    {
      id: 'income-below-1.2L',
      label: 'Annual family income < ₹1,20,000',
      mandatory: true,
      evaluate: (profile) => {
        const income = profile.annualIncome?.value;
        if (income === null) return { result: 'unknown', reason: 'Income not provided' };
        if (income < 120000) return { result: 'pass', reason: `Income ₹${income.toLocaleString('en-IN')} is below ₹1,20,000` };
        return { result: 'fail', reason: `Income ₹${income.toLocaleString('en-IN')} exceeds ₹1,20,000 limit for CMCHIS` };
      }
    },
    {
      id: 'tamil-nadu-resident',
      label: 'Resident of Tamil Nadu',
      mandatory: true,
      evaluate: (profile) => {
        const state = profile.state?.value;
        if (!state) return { result: 'unknown', reason: 'State not provided' };
        return state === 'tamil-nadu'
          ? { result: 'pass', reason: 'Tamil Nadu resident' }
          : { result: 'fail', reason: 'Scheme is for Tamil Nadu residents only' };
      }
    },
  ],

  'ayushman-bharat-pmjay': [
    {
      id: 'vulnerable-household',
      label: 'SECC 2011 vulnerable or BPL household',
      mandatory: false, // Expanded; senior citizens always qualify
      evaluate: (profile) => {
        const income = profile.annualIncome?.value;
        const age = profile.age?.value;
        // 70+ always eligible regardless of income
        if (age !== null && age >= 70) return { result: 'pass', reason: 'Age ≥ 70 — qualifies under Ayushman Vay Vandana Card' };
        if (income === null) return { result: 'unknown', reason: 'Income/SECC status not confirmed' };
        if (income < 150000) return { result: 'pass', reason: `Low income suggests BPL/SECC eligibility` };
        return { result: 'unknown', reason: 'Eligibility based on SECC 2011 data — requires official verification' };
      }
    },
  ],

  'pmay-urban-gramin': [
    {
      id: 'no-pucca-house',
      label: 'Does not own a pucca house',
      mandatory: true,
      evaluate: (profile) => {
        const housing = profile.housingStatus?.value;
        if (!housing) return { result: 'unknown', reason: 'Housing status not specified' };
        if (housing === 'kutcha') return { result: 'pass', reason: 'Lives in kutcha/temporary shelter' };
        if (housing === 'pucca-owner') return { result: 'fail', reason: 'Already owns a pucca house — not eligible' };
        if (housing === 'rented') return { result: 'unknown', reason: 'Renting — confirm no pucca house ownership anywhere in India' };
        return { result: 'unknown', reason: 'Housing status unclear' };
      }
    },
    {
      id: 'rural-resident',
      label: 'Rural resident (for PMAY-G) or urban (for PMAY-U)',
      mandatory: false,
      evaluate: (profile) => {
        const rt = profile.residenceType?.value;
        if (!rt) return { result: 'unknown', reason: 'Urban/rural residence not confirmed' };
        return { result: 'pass', reason: `${rt === 'rural' ? 'Rural (PMAY-G)' : 'Urban (PMAY-U)'} stream applicable` };
      }
    },
  ],

  'post-matric-scholarship': [
    {
      id: 'sc-st-obc-community',
      label: 'SC/ST/MBC/OBC/DNC community',
      mandatory: true,
      evaluate: (profile) => {
        const cat = profile.socialCategory?.value;
        if (!cat) return { result: 'unknown', reason: 'Social category not specified — only eligible for SC/ST/MBC/OBC' };
        const eligible = ['SC', 'ST', 'MBC', 'OBC'];
        if (eligible.includes(cat)) return { result: 'pass', reason: `${cat} community — eligible category` };
        return { result: 'fail', reason: `${cat} community is not covered by this scholarship` };
      }
    },
    {
      id: 'income-below-2.5L',
      label: 'Parental income < ₹2.5 Lakh (SC/ST) or < ₹2 Lakh (BC/MBC)',
      mandatory: true,
      evaluate: (profile) => {
        const income = profile.annualIncome?.value;
        const cat = profile.socialCategory?.value;
        if (income === null) return { result: 'unknown', reason: 'Income not provided' };
        const limit = (cat === 'SC' || cat === 'ST') ? 250000 : 200000;
        if (income < limit) return { result: 'pass', reason: `Income ₹${income.toLocaleString('en-IN')} within limit` };
        return { result: 'fail', reason: `Income ₹${income.toLocaleString('en-IN')} exceeds limit for ${cat}` };
      }
    },
    {
      id: 'post-secondary-student',
      label: 'Enrolled in post-secondary course',
      mandatory: true,
      evaluate: (profile) => {
        const st = profile.studentStatus?.value;
        if (!st?.isStudent) return { result: 'unknown', reason: 'Student status not specified' };
        return { result: 'pass', reason: 'Student status confirmed' };
      }
    },
    {
      id: 'tamil-nadu-resident',
      label: 'Resident of Tamil Nadu',
      mandatory: true,
      evaluate: (profile) => {
        const state = profile.state?.value;
        if (!state) return { result: 'unknown', reason: 'State not provided' };
        return state === 'tamil-nadu'
          ? { result: 'pass', reason: 'Tamil Nadu resident' }
          : { result: 'fail', reason: 'Scheme is for Tamil Nadu students' };
      }
    },
  ],
};

// ────────────────────────────────────────────────────────────
//  Quick profile-based filter (pre-screening before full eval)
// ────────────────────────────────────────────────────────────

function preScreen(scheme, profile) {
  // State check
  if (scheme.applicableStates && !scheme.applicableStates.includes('all')) {
    const state = profile.state?.value;
    if (state && !scheme.applicableStates.includes(state)) {
      return { skip: true, reason: `Not applicable in ${state}` };
    }
  }
  return { skip: false };
}

// ────────────────────────────────────────────────────────────
//  Main matcher
// ────────────────────────────────────────────────────────────

/**
 * @typedef {Object} EligibilityResult
 * @property {string} schemeId
 * @property {string} schemeName
 * @property {'potentially_eligible'|'needs_more_info'|'not_eligible'|'unable_to_verify'} status
 * @property {Array} satisfiedCriteria
 * @property {Array} failedCriteria
 * @property {Array} unknownCriteria
 * @property {string} summary
 * @property {number} confidenceScore  0–100
 */

/**
 * Evaluate a single scheme against the citizen profile.
 */
export function evaluateScheme(scheme, profile) {
  const rules = SCHEME_RULES[scheme.id] || [];

  const prescreenResult = preScreen(scheme, profile);
  if (prescreenResult.skip) {
    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      status: 'not_eligible',
      satisfiedCriteria: [],
      failedCriteria: [{ id: 'state-filter', label: 'State applicability', reason: prescreenResult.reason }],
      unknownCriteria: [],
      summary: prescreenResult.reason,
      confidenceScore: 0,
    };
  }

  if (rules.length === 0) {
    // No deterministic rules — needs RAG verification
    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      status: 'unable_to_verify',
      satisfiedCriteria: [],
      failedCriteria: [],
      unknownCriteria: [{ id: 'no-rules', label: 'Eligibility rules', reason: 'Detailed eligibility criteria not yet available in deterministic engine' }],
      summary: 'Eligibility requires official verification. Please review the official source.',
      confidenceScore: 0,
    };
  }

  const satisfied = [];
  const failed = [];
  const unknown = [];

  for (const rule of rules) {
    const { result, reason } = rule.evaluate(profile);
    const entry = { id: rule.id, label: rule.label, reason, mandatory: rule.mandatory };
    if (result === 'pass') satisfied.push(entry);
    else if (result === 'fail') failed.push(entry);
    else unknown.push(entry);
  }

  // Determine overall status
  const mandatoryFailed = failed.filter(r => r.mandatory);
  const mandatoryUnknown = unknown.filter(r => r.mandatory);

  let status;
  if (mandatoryFailed.length > 0) {
    status = 'not_eligible';
  } else if (mandatoryUnknown.length > 0) {
    status = 'needs_more_info';
  } else if (satisfied.length > 0) {
    status = 'potentially_eligible';
  } else {
    status = 'unable_to_verify';
  }

  // Confidence: more satisfied rules = higher confidence
  const totalRules = rules.length;
  const satisfiedCount = satisfied.length;
  const confidenceScore = totalRules > 0
    ? Math.round((satisfiedCount / totalRules) * 100)
    : 0;

  // Summary
  let summary = '';
  if (status === 'potentially_eligible') {
    summary = `Profile matches all known criteria (${satisfiedCount}/${totalRules}). Preliminary eligibility appears likely.`;
  } else if (status === 'needs_more_info') {
    summary = `${mandatoryUnknown.length} mandatory criterion still unknown: ${mandatoryUnknown.map(r => r.label).join(', ')}.`;
  } else if (status === 'not_eligible') {
    summary = `Does not meet: ${mandatoryFailed.map(r => r.label).join(', ')}.`;
  } else {
    summary = 'Eligibility cannot be determined from available profile information.';
  }

  return {
    schemeId: scheme.id,
    schemeName: scheme.name,
    tamilSchemeName: scheme.tamilName,
    hindiSchemeName: scheme.hindiName,
    status,
    satisfiedCriteria: satisfied,
    failedCriteria: failed,
    unknownCriteria: unknown,
    summary,
    confidenceScore,
  };
}

/**
 * Run matching against the full scheme catalogue and return sorted results.
 * Excludes 'not_eligible' by default unless showAll=true.
 */
export function matchSchemes(schemesData, profile, { showAll = false } = {}) {
  const results = schemesData
    .filter(s => !s.isMock)  // only verified schemes
    .map(scheme => {
      const evalResult = evaluateScheme(scheme, profile);
      return { ...evalResult, scheme };
    });

  // Sort: potentially_eligible > needs_more_info > unable_to_verify > not_eligible
  const statusOrder = {
    potentially_eligible: 0,
    needs_more_info: 1,
    unable_to_verify: 2,
    not_eligible: 3,
  };

  const sorted = results.sort((a, b) => {
    const orderDiff = statusOrder[a.status] - statusOrder[b.status];
    if (orderDiff !== 0) return orderDiff;
    return b.confidenceScore - a.confidenceScore;
  });

  if (!showAll) {
    return sorted.filter(r => r.status !== 'not_eligible');
  }
  return sorted;
}

/**
 * Generate follow-up questions based on missing profile fields and scheme context.
 */
export function generateFollowUpQuestions(profile, topResults, lang = 'en') {
  const questions = [];

  const missingAge = profile.age?.value === null;
  const missingState = profile.state?.value === null;
  const missingIncome = profile.annualIncome?.value === null;
  const missingGender = profile.gender?.value === null;
  const missingOccupation = profile.occupation?.value === null;
  const missingResidence = profile.residenceType?.value === null;

  if (lang === 'ta') {
    if (missingAge) questions.push('உங்கள் வயது என்ன?');
    if (missingState) questions.push('நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்?');
    if (missingIncome) questions.push('உங்கள் குடும்பத்தின் ஆண்டு வருமானம் என்ன?');
    if (missingGender) questions.push('நீங்கள் யாரிடம் (ஆண்/பெண்) கேட்கிறீர்கள்?');
    if (missingOccupation) questions.push('நீங்கள் என்ன தொழில் செய்கிறீர்கள்?');
    if (missingResidence) questions.push('நீங்கள் கிராமப்புறம் அல்லது நகர்ப்புறத்தில் வசிக்கிறீர்களா?');
  } else if (lang === 'hi') {
    if (missingAge) questions.push('आपकी उम्र क्या है?');
    if (missingState) questions.push('आप किस राज्य में रहते हैं?');
    if (missingIncome) questions.push('आपकी वार्षिक पारिवारिक आय कितनी है?');
    if (missingGender) questions.push('आप पुरुष हैं या महिला?');
    if (missingOccupation) questions.push('आप क्या काम करते हैं?');
    if (missingResidence) questions.push('आप ग्रामीण या शहरी क्षेत्र में रहते हैं?');
  } else {
    if (missingAge) questions.push('How old are you?');
    if (missingState) questions.push('Which state do you live in?');
    if (missingIncome) questions.push('What is your annual household income?');
    if (missingGender) questions.push('What is your gender?');
    if (missingOccupation) questions.push('What is your occupation or line of work?');
    if (missingResidence) questions.push('Do you live in a rural village or an urban area?');
  }

  // Scheme-specific follow-ups for top needs_more_info results
  for (const result of topResults.filter(r => r.status === 'needs_more_info').slice(0, 2)) {
    for (const unknownRule of result.unknownCriteria.slice(0, 1)) {
      const q = `(For ${result.schemeName}): ${unknownRule.reason}`;
      if (!questions.includes(q)) questions.push(q);
    }
  }

  return questions.slice(0, 5);
}
