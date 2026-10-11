import chatResponsesData from '../data/chatResponses.json';
import initialConversations from '../data/conversations.json';
import schemesData from '../data/schemes.json';
import documentsData from '../data/documents.json';
import * as apiClient from './apiClient';
import { detectLanguage } from '../utils/languageDetector';

const STORAGE_KEY = 'janabridge_conversations_v1';
// Separate storage key for backend conversation IDs (UUID → local conv ID mapping)
const BACKEND_CONV_KEY = 'janabridge_backend_conv_v1';


export const chatService = {
  /**
   * Load conversations from localStorage or seed initial mock conversations
   */
  getConversations: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map(conv => ({
          ...conv,
          messages: (conv.messages || []).map(msg => {
            if (msg.responseId && !msg.data) {
              const matched = chatResponsesData.find(r => r.id === msg.responseId);
              if (matched) {
                return { ...msg, data: { ...matched, response_language: 'english' } };
              }
            }
            return msg;
          })
        }));
      }
    } catch (e) {
      console.warn('Failed to read chat conversations from localStorage', e);
    }
    // Seed initial mock conversations with hydration
    const hydrated = initialConversations.map(conv => ({
      ...conv,
      messages: (conv.messages || []).map(msg => {
        if (msg.responseId && !msg.data) {
          const matched = chatResponsesData.find(r => r.id === msg.responseId);
          if (matched) {
            return { ...msg, data: { ...matched, response_language: 'english' } };
          }
        }
        return msg;
      })
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
    return hydrated;
  },

  saveConversations: (conversations) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save chat conversations', e);
    }
  },

  /**
   * Get or create a persistent backend conversation ID for the given local conv ID.
   */
  getBackendConvId: async (localConvId, title = 'New Inquiry') => {
    let mapping = {};
    try {
      mapping = JSON.parse(localStorage.getItem(BACKEND_CONV_KEY) || '{}');
    } catch (_) {}

    if (mapping[localConvId]) {
      return mapping[localConvId];
    }

    // Create a new conversation on the backend
    const backendConv = await apiClient.createConversation(title);
    mapping[localConvId] = backendConv.id;
    localStorage.setItem(BACKEND_CONV_KEY, JSON.stringify(mapping));
    return backendConv.id;
  },

  /**
   * Generate a response.
   *
   * Priority:
   *   1. Real backend (FastAPI → RAG → qwen3.5:0.8b via Ollama) — labeled isMock: false
   *   2. Demo Mode fallback if backend unreachable — labeled isMock: true, demoMode: true
   *
   * The backend response is mapped to the same shape as the mock responses
   * so the ChatMessage component renders correctly without changes.
   */
  generateResponse: async (query, language = 'en', convId = null) => {
    // --- Attempt real backend inference ---
    try {
      // Get or create a backend conversation
      let backendConvId;
      if (convId) {
        backendConvId = await chatService.getBackendConvId(convId, query.slice(0, 48));
      } else {
        const backendConv = await apiClient.createConversation(query.slice(0, 48));
        backendConvId = backendConv.id;
      }

      const msg = await apiClient.sendMessage(backendConvId, query, language);

      // Map backend citation format to the frontend citation format
      const citations = (msg.citations || []).map(c => ({
        title: c.source_title || c.document_id || 'Source Document',
        page: c.page != null ? String(c.page) : '—',
        snippet: c.snippet || '',
        sourceType: 'Government Document',
        verificationStatus: 'verified',
        citation_id: c.citation_id,
      }));

      const isInsufficient =
        msg.status === 'insufficient_evidence' ||
        (msg.content || msg.answer || '').toLowerCase().includes('insufficient evidence');

      const detectedLang = detectLanguage(msg.content || msg.answer || '', 'english');
      const responseLang = msg.response_language || detectedLang || 'english';

      return {
        id: `resp-${Date.now()}`,
        query,
        directAnswer: msg.content || msg.answer || '',
        benefits: [],
        eligibility: [],
        requiredDocuments: [],
        applicationSteps: [],
        importantNotes: null,
        citations,
        insufficientEvidence: isInsufficient,
        isMock: false,        // ← real local Ollama inference
        demoMode: false,
        backendConvId,
        backendMsgId: msg.id,
        response_language: responseLang,
      };
    } catch (backendErr) {
      console.warn(
        '[JanaBridge] Backend unavailable, switching to Demo Mode.',
        backendErr.message
      );
      // Fall through to Demo Mode below
    }

    // --- Demo Mode fallback ---
    return chatService._generateDemoResponse(query, language);
  },

  /**
   * Mock/Demo Mode response — clearly labeled.
   * Used ONLY when the backend is unreachable.
   */
  _generateDemoResponse: async (query, language = 'en') => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const clean = query.trim().toLowerCase();
    const fallbackLang = language === 'ta' ? 'tamil' : language === 'hi' ? 'hindi' : 'english';
    const detectedLang = detectLanguage(query, fallbackLang);

    const isTanglish = detectedLang === 'tanglish';
    const isTa = detectedLang === 'tamil' || language === 'ta';
    const isHi = detectedLang === 'hindi' || language === 'hi';

    const respLang = isTanglish ? 'tanglish' : isTa ? 'tamil' : isHi ? 'hindi' : 'english';

    // 1. Check pre-indexed chat responses
    for (const item of chatResponsesData) {
      if (item.matchedKeywords.some(kw => clean.includes(kw.toLowerCase()))) {
        return {
          id: `resp-${Date.now()}`,
          query,
          directAnswer: isTanglish
            ? (item.tanglishDirectAnswer || item.directAnswer)
            : isTa
            ? (item.tamilDirectAnswer || item.directAnswer)
            : isHi
            ? (item.hindiDirectAnswer || item.directAnswer)
            : item.directAnswer,
          benefits: isTanglish
            ? (item.tanglishBenefits || item.benefits || [])
            : isTa
            ? (item.tamilBenefits || item.benefits || [])
            : isHi
            ? (item.hindiBenefits || item.benefits || [])
            : (item.benefits || []),
          eligibility: isTanglish
            ? (item.tanglishEligibility || item.eligibility || [])
            : isTa
            ? (item.tamilEligibility || item.eligibility || [])
            : isHi
            ? (item.hindiEligibility || item.eligibility || [])
            : (item.eligibility || []),
          requiredDocuments: isTanglish
            ? (item.tanglishRequiredDocuments || item.requiredDocuments || [])
            : isTa
            ? (item.tamilRequiredDocuments || item.requiredDocuments || [])
            : isHi
            ? (item.hindiRequiredDocuments || item.requiredDocuments || [])
            : (item.requiredDocuments || []),
          applicationSteps: isTanglish
            ? (item.tanglishApplicationSteps || item.applicationSteps || [])
            : isTa
            ? (item.tamilApplicationSteps || item.applicationSteps || [])
            : isHi
            ? (item.hindiApplicationSteps || item.applicationSteps || [])
            : (item.applicationSteps || []),
          importantNotes: isTanglish
            ? (item.tanglishImportantNotes || item.importantNotes)
            : isTa
            ? (item.tamilImportantNotes || item.importantNotes)
            : isHi
            ? (item.hindiImportantNotes || item.importantNotes)
            : item.importantNotes,
          citations: item.citations || [],
          insufficientEvidence: !!item.insufficientEvidence,
          isMock: !!item.isMock,
          response_language: respLang
        };
      }
    }

    // 2. Dynamic keyword matching against Schemes database
    const matchedScheme = schemesData.find(s =>
      clean.includes(s.name.toLowerCase()) ||
      (s.tamilName && clean.includes(s.tamilName.toLowerCase())) ||
      (s.hindiName && clean.includes(s.hindiName.toLowerCase())) ||
      clean.includes(s.department.toLowerCase()) ||
      s.beneficiaryCategories.some(cat => clean.includes(cat))
    );

    if (matchedScheme) {
      const schemeName = isTa && matchedScheme.tamilName ? matchedScheme.tamilName : isHi && matchedScheme.hindiName ? matchedScheme.hindiName : matchedScheme.name;
      const schemeDesc = isTa && matchedScheme.tamilDescription ? matchedScheme.tamilDescription : isHi && matchedScheme.hindiDescription ? matchedScheme.hindiDescription : matchedScheme.description;
      const schemeDept = isTa && matchedScheme.tamilDepartment ? matchedScheme.tamilDepartment : isHi && matchedScheme.hindiDepartment ? matchedScheme.hindiDepartment : matchedScheme.department;

      return {
        id: `resp-${Date.now()}`,
        query,
        directAnswer: isTanglish
          ? `${matchedScheme.name} Department of ${matchedScheme.department} moolama implement panranga. ${matchedScheme.description}`
          : isTa
          ? `${schemeName} என்பது ${schemeDept} துறையின் கீழ் செயல்படுத்தப்படும் ${matchedScheme.governmentLevel === 'Central' ? 'மத்திய அரசு' : 'மாநில அரசு'} திட்டமாகும். ${schemeDesc}`
          : isHi
          ? `${schemeName} ${schemeDept} विभाग के अंतर्गत एक ${matchedScheme.governmentLevel === 'Central' ? 'केंद्रीय' : 'राज्य'} सरकारी योजना है। ${schemeDesc}`
          : `${matchedScheme.name} is a ${matchedScheme.governmentLevel} government scheme administered by the ${matchedScheme.department}. ${matchedScheme.description}`,
        benefits: isTa ? (matchedScheme.tamilBenefits || matchedScheme.benefits) : isHi ? (matchedScheme.hindiBenefits || matchedScheme.benefits) : matchedScheme.benefits,
        eligibility: isTa ? (matchedScheme.tamilEligibility || matchedScheme.eligibility) : isHi ? (matchedScheme.hindiEligibility || matchedScheme.eligibility) : matchedScheme.eligibility,
        requiredDocuments: isTa ? (matchedScheme.tamilRequiredDocuments || matchedScheme.requiredDocuments) : isHi ? (matchedScheme.hindiRequiredDocuments || matchedScheme.requiredDocuments) : matchedScheme.requiredDocuments,
        applicationSteps: isTa ? (matchedScheme.tamilApplicationSteps || matchedScheme.applicationSteps) : isHi ? (matchedScheme.hindiApplicationSteps || matchedScheme.applicationSteps) : matchedScheme.applicationSteps,
        importantNotes: isTa
          ? `அதிகாரப்பூர்வ ஆதாரம்: ${matchedScheme.officialSourceUrl} (${matchedScheme.verificationStatus})`
          : isHi
          ? `आधिकारिक स्रोत: ${matchedScheme.officialSourceUrl} (${matchedScheme.verificationStatus})`
          : `Official Source: ${matchedScheme.officialSourceUrl} (${matchedScheme.verificationStatus})`,
        citations: [
          {
            title: `${schemeName} ${isTa ? 'வழிகாட்டு நெறிமுறைகள்' : isHi ? 'दिशानिर्देश' : 'Scheme Guidelines'}`,
            page: isTa ? "அரசாணை சுருக்கம்" : isHi ? "सरकारी राजपत्र उद्धरण" : "Official Gazette Extract",
            snippet: isTa && matchedScheme.tamilOverview ? matchedScheme.tamilOverview : isHi && matchedScheme.hindiOverview ? matchedScheme.hindiOverview : matchedScheme.overview,
            sourceType: isTa ? "அரசு அறிவிப்பு" : isHi ? "सरकारी अधिसूचना" : "Government Notification",
            verificationStatus: matchedScheme.verificationStatus
          }
        ],
        insufficientEvidence: false,
        isMock: matchedScheme.isMock,
        response_language: respLang
      };
    }

    // 3. Dynamic keyword matching against Documents database
    const matchedDoc = documentsData.find(d =>
      clean.includes(d.name.toLowerCase()) ||
      (d.tamilName && clean.includes(d.tamilName.toLowerCase())) ||
      (d.hindiName && clean.includes(d.hindiName.toLowerCase())) ||
      clean.includes(d.id.replace('-', ' '))
    );

    if (matchedDoc) {
      const docName = isTa && matchedDoc.tamilName ? matchedDoc.tamilName : isHi && matchedDoc.hindiName ? matchedDoc.hindiName : matchedDoc.name;
      const docAuth = isTa && matchedDoc.tamilIssuingAuthority ? matchedDoc.tamilIssuingAuthority : isHi && matchedDoc.hindiIssuingAuthority ? matchedDoc.hindiIssuingAuthority : matchedDoc.issuingAuthority;
      const docPurpose = isTa && matchedDoc.tamilPurpose ? matchedDoc.tamilPurpose : isHi && matchedDoc.hindiPurpose ? matchedDoc.hindiPurpose : matchedDoc.purpose;

      return {
        id: `resp-${Date.now()}`,
        query,
        directAnswer: isTanglish
          ? `${matchedDoc.name} ${matchedDoc.issuingAuthority} moolama issue panranga. Purpose: ${matchedDoc.purpose}`
          : isTa
          ? `${docName} என்பது ${docAuth} ஆல் வழங்கப்படுகிறது. நோக்கம்: ${docPurpose}`
          : isHi
          ? `${docName} ${docAuth} द्वारा जारी किया जाता है। उद्देश्य: ${docPurpose}`
          : `${matchedDoc.name} is issued by the ${matchedDoc.issuingAuthority}. Purpose: ${matchedDoc.purpose}`,
        benefits: isTa ? (matchedDoc.tamilCommonUseCases || matchedDoc.commonUseCases) : isHi ? (matchedDoc.hindiCommonUseCases || matchedDoc.commonUseCases) : matchedDoc.commonUseCases,
        eligibility: isTa
          ? ["வருவாய்த்துறை அல்லது சம்பந்தப்பட்ட அதிகாரியின் தகுதி விதிகளுக்கு உட்பட்டது."]
          : isHi
          ? ["राजस्व विभाग या संबंधित प्राधिकारी के पात्रता नियमों के अधीन।"]
          : ["Must fulfill issuing criteria established by Revenue/State authority."],
        requiredDocuments: isTa ? (matchedDoc.tamilCommonlyRequestedSupportingDocuments || matchedDoc.commonlyRequestedSupportingDocuments) : isHi ? (matchedDoc.hindiCommonlyRequestedSupportingDocuments || matchedDoc.commonlyRequestedSupportingDocuments) : matchedDoc.commonlyRequestedSupportingDocuments,
        applicationSteps: isTa ? (matchedDoc.tamilApplicationSteps || matchedDoc.applicationSteps) : isHi ? (matchedDoc.hindiApplicationSteps || matchedDoc.applicationSteps) : matchedDoc.applicationSteps,
        importantNotes: isTa
          ? `செல்லுபடியாகும் காலம்: ${matchedDoc.tamilValidity || matchedDoc.validity}. அதிகாரப்பூர்வ தளம்: ${matchedDoc.officialSourceUrl}`
          : isHi
          ? `वैधता: ${matchedDoc.hindiValidity || matchedDoc.validity}. आधिकारिक पोर्टल: ${matchedDoc.officialSourceUrl}`
          : `Validity: ${matchedDoc.validity}. Official portal: ${matchedDoc.officialSourceUrl}`,
        citations: [
          {
            title: `${docName} ${isTa ? 'வழங்கல் நெறிமுறைகள்' : isHi ? 'जारी करने के दिशानिर्देश' : 'Issuance Guidelines'}`,
            page: isTa ? "குடிமக்கள் கையேடு" : isHi ? "नागरिक पोर्टल पुस्तिका" : "Citizen Portal Handbook",
            snippet: `${isTa ? 'சட்டப்பூர்வ சரிபார்ப்பின் கீழ் வழங்கப்பட்டது:' : isHi ? 'सत्यापन के तहत जारी:' : 'Issued under statutory verification by'} ${docAuth}.`,
            sourceType: isTa ? "துறை கையேடு" : isHi ? "विभागीय नियमावली" : "Department Manual",
            verificationStatus: matchedDoc.verificationStatus
          }
        ],
        insufficientEvidence: false,
        isMock: matchedDoc.isMock,
        response_language: respLang
      };
    }

    // 4. Fallback / Insufficient Evidence response
    return {
      id: `resp-${Date.now()}`,
      query,
      directAnswer: isTanglish
        ? "Unga kelvikku official government welfare schemes or records JanaBridge knowledge index-la kedaikkala."
        : isTa
        ? "உங்கள் கேள்விக்குரிய அதிகாரப்பூர்வ அரசு நலத்திட்டங்கள் அல்லது சட்டப்பூர்வ பதிவுகள் ஜனபிரிட்ஜ் வழிகாட்டி பதிவேட்டில் கண்டறியப்படவில்லை."
        : isHi
        ? "जनब्रिज ज्ञानकोष में आपके प्रश्न से संबंधित कोई सत्यापित सरकारी रिकॉर्ड या कल्याणकारी योजना नहीं मिली।"
        : "I could not identify verified official records or statutory government schemes directly matching your specific phrasing in the JanaBridge knowledge index.",
      benefits: [],
      eligibility: [],
      requiredDocuments: [],
      applicationSteps: isTanglish
        ? [
            "'Income certificate', 'PM KISAN', 'Old age pension', 'Ration card' mathiri standard terms use panni thedunga.",
            "Sidebar-la irukkira Government Schemes page or Services directory-ai paarunga.",
            "Official state e-Sevai portal-la check pannunga."
          ]
        : isTa
        ? [
            "'வருமானச் சான்றிதழ்', 'பி.எம் கிசான்', 'முதியோர் ஓய்வூதியம்', 'ரேஷன் கார்டு' போன்ற பொதுவான சொற்களைப் பயன்படுத்தி தேடவும்.",
            "பக்கவாட்டு மெனுவில் உள்ள அரசு நலத்திட்டங்கள் அல்லது சேவைகள் பக்கத்தைப் பார்வையிடவும்.",
            "அதிகாரப்பூர்வ இ-சேவை அல்லது அரசு இணையதளங்களில் சரிபார்க்கவும்."
          ]
        : isHi
        ? [
            "'आय प्रमाण पत्र', 'पीएम किसान', 'वृद्धावस्था पेंशन', 'राशन कार्ड' जैसे सामान्य शब्दों से खोजें।",
            "साइडबार से कल्याणकारी योजनाएं या सरकारी सेवाएं डायरेक्टरी देखें।",
            "आधिकारिक ई-सेवा या सरकारी पोर्टल पर जांच करें।"
          ]
        : [
            "Try searching with standard terms (e.g., 'income certificate', 'PM KISAN', 'senior citizen pension', 'ration card').",
            "Browse the Government Schemes page or Services directory from the sidebar.",
            "Check official state e-Sevai or national government portals."
          ],
      importantNotes: isTanglish
        ? "JanaBridge central and state government verified notifications mattume provide pannum."
        : isTa
        ? "ஜனபிரிட்ஜ் மத்திய மற்றும் மாநில அரசு அறிவிப்புகளின் அடிப்படையில் சரிபார்க்கப்பட்ட தகவல்களை மட்டுமே வழங்குகிறது."
        : isHi
        ? "जनब्रिज केवल आधिकारिक सरकारी अधिसूचनाओं के आधार पर सत्यापित जानकारी प्रदान करता है।"
        : "JanaBridge strictly enforces evidence-based guidelines. We only present information verified against central and state government notifications.",
      citations: [],
      insufficientEvidence: true,
      isMock: true,
      response_language: respLang
    };
  }
};
