import re
from typing import List, Dict, Optional
from app.schemas.chat import ChatResponse, ChatCitation
from app.utils.language_detector import detect_language

class FAQSystem:
    def __init__(self):
        self.faqs = [
            {
                "id": "income_cert",
                "questions": [
                    "income certificate epdi apply panradhu",
                    "enakku varumana saanrithal venum",
                    "how to apply for income certificate",
                    "how do i apply for an income certificate",
                    "varumana sandrithal vinnappippathu eppadi",
                    "வருமானச் சான்றிதழுக்கு எப்படி விண்ணப்பிப்பது",
                    "வருமான சான்றிதழ் விண்ணப்பிப்பது எப்படி",
                    "வருமானச் சான்றிதழ்",
                    "आय प्रमाण पत्र के लिए आवेदन कैसे करें",
                    "आय प्रमाण पत्र कैसे बनाएं",
                    "आय प्रमाण पत्र"
                ],
                "answers": {
                    "english": "To apply for an Income Certificate, visit the nearest e-Sevai centre with your Aadhaar card, Ration Card, and salary slip. You can also apply online through the TNeGA portal.",
                    "tanglish": "Income certificate apply panna, Tamil Nadu e-Sevai portal-ku ponga. Login pannitu Income Certificate service select pannunga. Required documents upload panni application submit pannunga. Acknowledgement number save pannunga.",
                    "tamil": "வருமானச் சான்றிதழுக்கு விண்ணப்பிக்க, தமிழ்நாடு இ-சேவை (TNeGA) போர்ட்டலுக்குச் செல்லவும். லாகின் செய்து 'Income Certificate' சேவையைத் தேர்ந்தெடுத்து, தேவையான ஆவணங்களைப் பதிவேற்றி விண்ணப்பத்தை சமர்ப்பிக்கவும். ஒப்புதல் எண்ணை (Acknowledgement Number) குறித்து வைத்துக் கொள்ளவும்.",
                    "hindi": "आय प्रमाण पत्र के लिए आवेदन करने हेतु तमिलनाडु ई-सेवा (TNeGA) पोर्टल पर जाएं। लॉगिन करके Income Certificate सेवा चुनें, आवश्यक दस्तावेज अपलोड करें और आवेदन जमा करें। पावती संख्या (Acknowledgement Number) सुरक्षित रखें।"
                },
                "url": "https://www.tnesevai.tn.gov.in/"
            },
            {
                "id": "community_cert",
                "questions": [
                    "community certificate ku enna documents venum",
                    "what documents are needed for community certificate",
                    "saathi saanrithaluku thevaiyana aavanangal",
                    "சாதிச் சான்றிதழுக்கு என்ன ஆவணங்கள் தேவை",
                    "சாதி சான்றிதழ் ஆவணங்கள்",
                    "जाति प्रमाण पत्र के लिए क्या दस्तावेज चाहिए"
                ],
                "answers": {
                    "english": "For a Community Certificate, you need: 1. Photo, 2. Any Address Proof, 3. Community Certificate of Father/Mother/Siblings, 4. Self-Declaration.",
                    "tanglish": "Community Certificate-ku thevaiyana documents: 1. Passport size photo, 2. Address proof (Aadhaar/Ration Card), 3. Appa/Amma/Siblings-oda Community Certificate, 4. Self-declaration form.",
                    "tamil": "சாதிச் சான்றிதழ் பெற தேவையான ஆவணங்கள்: 1. புகைப்படம், 2. முகவரிச் சான்று (ஆதார்/குடும்ப அட்டை), 3. பெற்றோர் அல்லது உடன்பிறந்தோரின் சாதிச் சான்றிதழ், 4. சுய உறுதிமொழிப் படிவம்.",
                    "hindi": "जाति प्रमाण पत्र के लिए आवश्यक दस्तावेज: 1. फोटो, 2. पते का प्रमाण, 3. माता-पिता या भाई-बहन का जाति प्रमाण पत्र, 4. स्व-घोषणा पत्र।"
                },
                "url": "https://www.tnesevai.tn.gov.in/"
            },
            {
                "id": "nativity_cert",
                "questions": [
                    "nativity certificate eppadi edukkurathu",
                    "how to get nativity certificate",
                    "iruppida saanrithal peruvathu eppadi",
                    "இருப்பிட சான்றிதழ் பெறுவது எப்படி",
                    "निवास प्रमाण पत्र कैसे प्राप्त करें"
                ],
                "answers": {
                    "english": "You can get a Nativity Certificate by applying online at the TNeGA portal or visiting an e-Sevai centre with proof of continuous residence for 5 years.",
                    "tanglish": "Nativity Certificate vanga, TNeGA portal-la apply pannalam illa nearest e-Sevai centre-ku ponga. 5 varusham continuous residence proof thevai.",
                    "tamil": "இருப்பிடச் சான்றிதழ் பெற TNeGA இணையதளம் மூலமாகவோ அல்லது அருகிலுள்ள இ-சேவை மையம் மூலமாகவோ விண்ணப்பிக்கலாம். குறைந்தது 5 ஆண்டுகள் வசித்ததற்கான குடியிருப்புச் சான்று தேவை.",
                    "hindi": "आप TNeGA पोर्टल पर ऑनलाइन आवेदन करके या नजदीकी ई-सेवा केंद्र पर 5 वर्षों के निरंतर निवास प्रमाण के साथ जाकर निवास प्रमाण पत्र प्राप्त कर सकते हैं।"
                },
                "url": "https://www.tnesevai.tn.gov.in/"
            },
            {
                "id": "can_number",
                "questions": [
                    "CAN na enna",
                    "what is CAN number",
                    "can number endral enna",
                    "what is can",
                    "கேன் எண் என்றால் என்ன",
                    "कैन नंबर क्या है"
                ],
                "answers": {
                    "english": "CAN (Citizen Access Number) is a unique registration number required to avail e-Sevai services in Tamil Nadu. It stores your basic demographic details to speed up applications.",
                    "tanglish": "CAN (Citizen Access Number) nu solradhu Tamil Nadu e-Sevai services use panna thevaiyana unique registration number. Idhu unga demographic details store panni application-a speed up pannum.",
                    "tamil": "CAN (Citizen Access Number) என்பது தமிழ்நாட்டில் இ-சேவை சேவைகளைப் பெறத் தேவையான தனித்துவமான பதிவு எண் ஆகும். இது உங்கள் அடிப்படை விவரங்களைச் சேமித்து விண்ணப்பங்களை விரைவுபடுத்த உதவுகிறது.",
                    "hindi": "CAN (सिटीजन एक्सेस नंबर) तमिलनाडु में ई-सेवा सेवाओं का लाभ उठाने के लिए आवश्यक एक विशिष्ट पंजीकरण संख्या है। यह आपके जनसांख्यिकीय विवरण संग्रहीत करता है।"
                },
                "url": "https://www.tnesevai.tn.gov.in/"
            },
            {
                "id": "app_status",
                "questions": [
                    "application status epdi check panradhu",
                    "how to check application status",
                    "vinnappa nilaiyai eppadi sari paarppathu",
                    "விண்ணப்ப நிலையை எவ்வாறு சரிபார்ப்பது",
                    "आवेदन की स्थिति कैसे जांचें"
                ],
                "answers": {
                    "english": "You can check your application status by logging into the portal where you applied and entering your Application Number.",
                    "tanglish": "Application status check panna, neenga apply panna e-Sevai portal-ku poyi unga Application Number enter panni track pannalam.",
                    "tamil": "உங்கள் விண்ணப்ப நிலையை அறிய, விண்ணப்பித்த இ-சேவை இணையதளத்தில் உங்கள் விண்ணப்ப எண்ணை (Application Number) உள்ளிட்டு சரிபார்க்கலாம்.",
                    "hindi": "आप अपने आवेदन की स्थिति की जांच करने के लिए उस पोर्टल पर लॉगिन करें जहां आपने आवेदन किया था और अपनी आवेदन संख्या दर्ज करें।"
                },
                "url": "https://www.tnesevai.tn.gov.in/"
            },
            {
                "id": "cert_reject",
                "questions": [
                    "certificate reject aayiduchu enna panradhu",
                    "what to do if certificate is rejected",
                    "saanrithal niragarikkappattal enna seivathu",
                    "சான்றிதழ் நிராகரிக்கப்பட்டால் என்ன செய்வது",
                    "यदि प्रमाण पत्र खारिज हो जाए तो क्या करें"
                ],
                "answers": {
                    "english": "If your certificate is rejected, check the rejection reason provided in the portal. Rectify the mentioned issue (e.g., missing documents) and reapply.",
                    "tanglish": "Certificate reject aayiduchuna, portal-la enna reason potrukaanga nu check pannunga. Mention panna issue-va (documents missing mathiri) sari panni marubadiyum reapply pannunga.",
                    "tamil": "உங்கள் சான்றிதழ் நிராகரிக்கப்பட்டால், போர்ட்டலில் குறிப்பிடப்பட்டுள்ள காரணத்தைச் சரிபார்க்கவும். குறிப்பிட்ட குறைபாடுகளை நிவர்த்தி செய்து மீண்டும் விண்ணப்பிக்கவும்.",
                    "hindi": "यदि आपका प्रमाण पत्र खारिज हो जाता है, तो पोर्टल में दिए गए कारण की जांच करें। उल्लिखित त्रुटि को सुधारें और पुनः आवेदन करें।"
                },
                "url": "https://www.tnesevai.tn.gov.in/"
            },
            {
                "id": "magalir_urimai",
                "questions": [
                    "magalir urimai thogai ku epdi apply panrathu",
                    "how to apply for magalir urimai thogai",
                    "kalaignar magalir urimai thogai vinnappippathu eppadi",
                    "மகளிர் உரிமைத் தொகைக்கு எப்படி விண்ணப்பிப்பது",
                    "மகளிர் உரிமை தொகை",
                    "कलैग्नार महिला अधिकार योजना में आवेदन कैसे करें"
                ],
                "answers": {
                    "english": "For the Kalaignar Magalir Urimai Thogai scheme, special camps are periodically held. Please check official state announcements for the next registration window. Currently, online applications are subject to government notifications.",
                    "tanglish": "Kalaignar Magalir Urimai Thogai-kku special camps nadathuraanga. Next registration camp eppo nu official government announcements check pannunga.",
                    "tamil": "கலைஞர் மகளிர் உரிமைத் தொகை திட்டத்திற்கு சிறப்பு முகாம்கள் நடத்தப்படுகின்றன. அடுத்த பதிவு முகாம் குறித்து அரசு வெளியிடும் அதிகாரப்பூர்வ அறிவிப்புகளைப் பார்க்கவும்.",
                    "hindi": "कलैग्नार महिला अधिकार योजना के लिए समय-समय पर विशेष शिविर आयोजित किए जाते हैं। अगली पंजीकरण विंडो के लिए आधिकारिक सरकारी घोषणाओं की जांच करें।"
                },
                "url": "https://kmut.tn.gov.in/"
            },
            {
                "id": "ration_card",
                "questions": [
                    "ration card apply panradhu eppadi",
                    "how to apply for ration card",
                    "smart card ku epdi apply panrathu",
                    "ரேஷன் கார்டுக்கு எப்படி விண்ணப்பிப்பது",
                    "ஸ்மார்ட் கார்டு",
                    "राशन कार्ड के लिए आवेदन कैसे करें"
                ],
                "answers": {
                    "english": "You can apply for a new Smart Ration Card online through the TNPDS portal (tnpds.gov.in) using your Aadhaar card and address proof.",
                    "tanglish": "Pudhu Smart Ration Card apply panna, TNPDS portal (tnpds.gov.in)-ku ponga. Aadhaar card mattrum address proof upload panni apply pannunga.",
                    "tamil": "புதிய ஸ்மார்ட் குடும்ப அட்டைக்கு (ரேஷன் கார்டு) விண்ணப்பிக்க, TNPDS இணையதளம் (tnpds.gov.in) மூலமாக ஆதார் அட்டை மற்றும் முகவரிச் சான்றைப் பதிவேற்றி விண்ணப்பிக்கலாம்.",
                    "hindi": "आप TNPDS पोर्टल (tnpds.gov.in) के माध्यम से अपने आधार कार्ड और पते के प्रमाण का उपयोग करके नए स्मार्ट राशन कार्ड के लिए ऑनलाइन आवेदन कर सकते हैं।"
                },
                "url": "https://www.tnpds.gov.in/"
            },
            {
                "id": "patta_chitta",
                "questions": [
                    "patta chitta epdi check panradhu",
                    "how to view patta chitta",
                    "patta chitta online checking",
                    "பட்டா சிட்டா பார்ப்பது எப்படி",
                    "பட்டா சிட்டா",
                    "पट्टा चित्ता ऑनलाइन कैसे देखें"
                ],
                "answers": {
                    "english": "You can view and download your Patta/Chitta online from the Tamil Nadu e-Services portal (eservices.tn.gov.in) by selecting your District, Taluk, and Village.",
                    "tanglish": "Patta/Chitta check panna, Tamil Nadu e-Services portal (eservices.tn.gov.in)-la unga District, Taluk, mattrum Village select panni view and download pannikalam.",
                    "tamil": "உங்கள் பட்டா / சிட்டாவைப் பார்வையிட மற்றும் பதிவிறக்கம் செய்ய, தமிழக அரசின் e-Services இணையதளத்தில் (eservices.tn.gov.in) மாவட்டம், வட்டம் மற்றும் கிராமத்தைத் தேர்ந்தெடுத்துப் பார்க்கலாம்.",
                    "hindi": "आप तमिलनाडु ई-सेवा पोर्टल (eservices.tn.gov.in) से अपना जिला, तालुक और गांव चुनकर पट्टा/चित्ता ऑनलाइन देख और डाउनलोड कर सकते हैं।"
                },
                "url": "https://eservices.tn.gov.in/"
            },
            {
                "id": "pension",
                "questions": [
                    "pension scheme ku epdi apply panrathu",
                    "how to apply for old age pension",
                    "muthiyor oivu oothiyam apply panradhu",
                    "முதியோர் ஓய்வூதியம் பெறுவது எப்படி",
                    "முதியோர் உதவித்தொகை",
                    "वृद्धावस्था पेंशन के लिए आवेदन कैसे करें"
                ],
                "answers": {
                    "english": "To apply for the Old Age Pension (OAP) scheme, submit the required application form along with Aadhaar, Ration Card, and bank details to the local Tahsildar office or via e-Sevai.",
                    "tanglish": "Old Age Pension (OAP) scheme apply panna, application form kooda Aadhaar, Ration Card, mattrum Bank passbook details vachu local Tahsildar office-la submit pannunga illa e-Sevai centre-ku ponga.",
                    "tamil": "முதியோர் ஓய்வூதியத் திட்டத்திற்கு (OAP) விண்ணப்பிக்க, ஆதார், குடும்ப அட்டை மற்றும் வங்கிக் கணக்கு விவரங்களுடன் உள்ளூர் வட்டாட்சியர் (Tahsildar) அலுவலகத்தில் அல்லது இ-சேவை மையம் மூலம் சமர்ப்பிக்கவும்.",
                    "hindi": "वृद्धावस्था पेंशन (OAP) योजना के लिए आवेदन करने के लिए, आधार, राशन कार्ड और बैंक विवरण के साथ स्थानीय तहसीलदार कार्यालय या ई-सेवा केंद्र पर जाएं।"
                },
                "url": "https://www.tnesevai.tn.gov.in/"
            }
        ]

    def _normalize(self, text: str) -> str:
        # Keep alphabets, numbers, and basic spaces, handle both ascii and unicode (Tamil/Devanagari)
        return re.sub(r'[^\w\s]', '', text.lower(), flags=re.UNICODE).strip()

    def _resolve_context(self, question: str, history: List[Dict]) -> str:
        """If question is a short follow-up, prepend context from history."""
        norm = self._normalize(question)
        follow_up_phrases = ["how to apply", "apply panradhu", "how do i apply", "what documents", "documents venum", "this", "ithu", "eppadi"]

        if len(norm.split()) <= 5 or any(phrase in norm for phrase in follow_up_phrases):
            for msg in reversed(history):
                if msg.get("role") == "assistant" and msg.get("content"):
                    return f"{msg.get('content')} {question}"
        return question

    def match(self, question: str, history: List[Dict] = None, requested_language: Optional[str] = None) -> Optional[ChatResponse]:
        if history is None:
            history = []

        # 1. Detect language of the question
        detected_lang = detect_language(question)
        if detected_lang == "english" and requested_language in ["tanglish", "tamil", "hindi"]:
            # Check if user explicitly passed a non-english language with ambiguous text
            if len(question.strip().split()) <= 2:
                detected_lang = requested_language

        contextual_question = self._resolve_context(question, history)
        norm_q = self._normalize(contextual_question)

        # 2. Check each FAQ
        for faq in self.faqs:
            for q in faq["questions"]:
                norm_faq = self._normalize(q)
                if norm_faq in norm_q or norm_q == norm_faq or (len(norm_q) > 6 and norm_q in norm_faq):
                    return self._build_response(faq, detected_lang)

        # 3. Keyword matching
        keyword_map = {
            "income certificate": "income_cert",
            "வருமான": "income_cert",
            "आय प्रमाण": "income_cert",
            "varumana": "income_cert",
            "community certificate": "community_cert",
            "சாதி": "community_cert",
            "जाति प्रमाण": "community_cert",
            "saathi": "community_cert",
            "nativity certificate": "nativity_cert",
            "இருப்பிட": "nativity_cert",
            "निवास प्रमाण": "nativity_cert",
            "iruppida": "nativity_cert",
            "can number": "can_number",
            "கேன் எண்": "can_number",
            "कैन नंबर": "can_number",
            "status": "app_status",
            "நிலை": "app_status",
            "स्थिति": "app_status",
            "reject": "cert_reject",
            "நிராகரிக்க": "cert_reject",
            "खारिज": "cert_reject",
            "magalir": "magalir_urimai",
            "மகளிர்": "magalir_urimai",
            "महिला अधिकार": "magalir_urimai",
            "ration card": "ration_card",
            "குடும்ப அட்டை": "ration_card",
            "ரேஷன்": "ration_card",
            "ராஷன்": "ration_card",
            "राशन कार्ड": "ration_card",
            "smart card": "ration_card",
            "patta": "patta_chitta",
            "chitta": "patta_chitta",
            "பட்டா": "patta_chitta",
            "சிட்டா": "patta_chitta",
            "पट्टा": "patta_chitta",
            "चित्ता": "patta_chitta",
            "pension": "pension",
            "ஓய்வூதியம்": "pension",
            "உதவித்தொகை": "pension",
            "पेंशन": "pension",
            "oivu": "pension",
            "muthiyor": "pension"
        }

        for kw, intent_id in keyword_map.items():
            if self._normalize(kw) in norm_q:
                for faq in self.faqs:
                    if faq["id"] == intent_id:
                        return self._build_response(faq, detected_lang)

        return None

    def _build_response(self, faq: dict, target_lang: str) -> ChatResponse:
        answer = faq["answers"].get(target_lang, faq["answers"]["english"])
        citation = ChatCitation(
            citation_id="faq_1",
            document_id="FAQ Database",
            source_title=faq["url"],
            page=1,
            snippet=answer
        )
        return ChatResponse(
            status="answered",
            answer=answer,
            citations=[citation],
            response_language=target_lang
        )

faq_system = FAQSystem()
