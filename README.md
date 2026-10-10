# JanaBridge — Bridging People to Government Services

**JanaBridge** is a multilingual, accessible government-services discovery and navigation platform built with React, Vite, and Tailwind CSS. It empowers Indian citizens—including rural communities, senior citizens, students, farmers, workers, women, and first-time digital users—to seamlessly discover welfare schemes, understand eligibility criteria, review required supporting documents, and access application workflows.

---

## 🌟 Key Features

1. **Home Dashboard**
   - **Hero Discovery Bar**: Global search and speech-inquiry assistant with popular search chips.
   - **Promotional Banner**: UMANG-inspired clean public portal design.
   - **Quick Services & Citizen Categories**: Categorized by demographic needs (Farmers, Students, Senior Citizens, Women & Children, Persons with Disabilities, Workers, Small Business Owners).
   - **Latest Schemes & Updates**: Central and state welfare cards with statutory verification status and mock labels.
   - **Documents You Might Need**: Checklist for Aadhaar, PAN, Income Certificate, Community Certificate, Patta/Chitta land records, and educational certificates.
   - **State Selector**: Tamil Nadu state context selected by default with all Indian States & UTs.
   - **Essential Helplines**: 24x7 verified emergency, farmer (Kisan Call Centre 1800-180-1551), elderline (14567), and women safety hotlines.

2. **Government Services Directory (`/services` & `/services/:id`)**
   - Multilingual service catalogue across 9 categories (Identity & Certificates, Health, Education, Agriculture, Transport, Utilities, etc.).
   - Search, department filters, and category chips.
   - 9-part structured detail pages with required documents and step-by-step procedures.

3. **Government Schemes Discovery (`/schemes` & `/schemes/:id`)**
   - Interactive **"Find Schemes for My Needs"** circumstance matching wizard.
   - Central vs State government level filters.
   - Comprehensive detail views with overview, benefits breakdown, eligibility rules, document checklists, official source links, and verification status.

4. **Ask JanaBridge AI Assistant (`/chat`)**
   - Modern conversation interface structured with mock RAG evidence retrieval.
   - Structured responses: Direct answer, benefits, eligibility, required documents, application steps, and **Source Citation Cards** (with statutory document title, page number, and quoted snippet).
   - Handles multi-conversation management, edit & resubmit prompts, message copying, and unverified inquiry handling.

5. **Tamil Nadu State Portal (`/tamil-nadu`)**
   - Focus portal for Tamil Nadu e-Sevai, Patta/Chitta (AnyTime Anywhere & Tamil Nilam), Kalaignar Magalir Urimai Thogai, and Pudhumai Penn schemes.
   - Frontend district selector across all 38 Tamil Nadu districts.

6. **Document Guide & Checklist (`/documents` & `/documents/:id`)**
   - Complete guides for obtaining essential identity and revenue certificates.

7. **Saved Items (`/saved`) & Chat History (`/chat-history`)**
   - Offline bookmarking stored persistently in browser `localStorage`.
   - Searchable past conversation logs with title editing and confirmation deletion.

8. **Multilingual & Accessibility**
   - **Languages**: English, தமிழ் (Tamil), हिन्दी (Hindi).
   - **Accessibility**: Font size scaling (Normal, Large, Extra Large), High Contrast toggle, Dark/Light theme toggle, and keyboard navigation.
   - **Voice Interaction**: Simulated speech recognition with fallback to Web Speech API.

---

## 🛠️ Technology Stack

- **Framework**: React 19 with Vite 8
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with custom government color tokens
- **Icons**: Lucide React
- **Data & Services**: Structured JSON data models with asynchronous service abstractions (`mockApi.js`, `searchService.js`, `chatService.js`)
- **State Management**: React Context (`LanguageContext`, `ThemeContext`, `StateContext`, `SavedItemsContext`)
- **Persistence**: Browser `localStorage`

---

## 🚀 Running the Application Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🏛️ Future Backend Architecture

The frontend is architected with a decoupled `src/services/` layer so that a local Python FastAPI backend and local RAG retrieval pipeline can be plugged in directly without modifying UI components.
