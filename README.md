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


---

# JanaBridge — BOOKMARK RAG Backend

**BOOKMARK** is a privacy-first, locally-hosted government-services assistant for Indian citizens, with an initial focus on Tamil Nadu. All document processing, embedding, retrieval, and inference run entirely on your machine via [Ollama](https://ollama.com/). No data leaves your device.

## Architecture

```
backend/
├── main.py              ← FastAPI entry point
├── config.py            ← Centralised settings (env/file overrides)
├── models.py            ← Pydantic request/response schemas
├── routers/
│   ├── health.py        ← GET  /api/v1/health
│   ├── documents.py     ← POST /api/v1/documents/index
│   └── chat.py          ← POST /api/v1/chat
├── services/
│   ├── pdf_loader.py    ← PDF text extraction (PyMuPDF)
│   ├── chunker.py       ← Overlapping text chunking with metadata
│   ├── embedder.py      ← Ollama /api/embed client (batched)
│   ├── vector_store.py  ← ChromaDB persistent vector storage
│   ├── bm25_retriever.py← BM25 keyword index (rank-bm25)
│   ├── retriever.py     ← Hybrid retrieval + RRF fusion
│   ├── generator.py     ← Ollama /api/chat + citation validation
│   └── rag_pipeline.py  ← Orchestrates indexing & query flows
└── tests/               ← Automated tests (mocked Ollama)
```

## Prerequisites

- **Python 3.13+**
- **Ollama** running locally at `http://localhost:11434`
- Models pulled in Ollama:
  ```powershell
  ollama pull qwen2.5:3b-instruct
  ollama pull qwen3-embedding:0.6b
  ```

## Setup (Windows)

```powershell
# From the repository root (JanaBridge/)
pip install -r requirements.txt

# Create the documents directory
mkdir documents
```

## Usage

### 1. Start the backend

```powershell
# From the repository root
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

The API docs are at `http://127.0.0.1:8000/docs`.

### 2. Check health

```powershell
curl http://127.0.0.1:8000/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "ollama_reachable": true,
  "models": [
    {"name": "qwen3-embedding:0.6b", "available": true},
    {"name": "qwen2.5:3b-instruct", "available": true}
  ],
  "message": "All systems operational."
}
```

### 3. Index documents

Place one or more government PDF files in the `documents/` directory, then:

```powershell
curl -X POST http://127.0.0.1:8000/api/v1/documents/index
```

Response:
```json
{
  "status": "indexed",
  "documents_found": 1,
  "total_pages": 12,
  "total_chunks": 45,
  "message": "Successfully indexed 45 chunks from 1 document(s)."
}
```

### 4. Ask a question

```powershell
curl -X POST http://127.0.0.1:8000/api/v1/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"question\": \"What are the eligibility criteria for the solar rooftop scheme?\"}"
```

Response schema:
```json
{
  "answer": "According to the document, applicants must... [1] [2]",
  "status": "answered",
  "citations": [
    {
      "citation_id": 1,
      "source_file": "solar_scheme.pdf",
      "page_number": 3,
      "snippet": "The applicant must be a resident of Tamil Nadu..."
    },
    {
      "citation_id": 2,
      "source_file": "solar_scheme.pdf",
      "page_number": 4,
      "snippet": "Annual household income must not exceed Rs. 3,00,000..."
    }
  ]
}
```

### 5. Verify insufficient-evidence behavior

Ask an unrelated question:

```powershell
curl -X POST http://127.0.0.1:8000/api/v1/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"question\": \"What is the weather forecast for Tokyo?\"}"
```

Expected: `"status": "insufficient_evidence"` with no citations.

## Running Tests

```powershell
# From the repository root
python -m pytest backend/tests/ -v
```

All tests mock Ollama HTTP calls — no live model required.

## Configuration

All settings can be overridden via environment variables or a `.env` file in the project root:

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama endpoint |
| `GENERATION_MODEL` | `qwen2.5:3b-instruct` | Chat model |
| `EMBEDDING_MODEL` | `qwen3-embedding:0.6b` | Embedding model |
| `DOCUMENTS_DIR` | `./documents` | PDF directory |
| `CHUNK_SIZE` | `512` | Characters per chunk |
| `CHUNK_OVERLAP` | `64` | Overlap between chunks |
| `TOP_K_FINAL` | `5` | Chunks sent to the LLM |
| `MAX_SEMANTIC_DISTANCE` | `1.4` | Relevance threshold (heuristic) |
| `MIN_RELEVANT_FRACTION` | `0.2` | Min fraction of relevant results |
| `EMBEDDING_BATCH_SIZE` | `32` | Texts per embedding request |

## Limitations

- **Relevance thresholds are initial heuristics.** `MAX_SEMANTIC_DISTANCE` and `MIN_RELEVANT_FRACTION` need tuning with real evaluation queries.
- **Full rebuild on re-index.** The current milestone does a complete rebuild of both ChromaDB and BM25 indexes on every `/documents/index` call. Incremental indexing is not yet implemented.
- **Single-user.** No authentication or session management.
- **English/Tamil text only.** OCR and scanned PDFs are not supported.
- **No streaming.** Chat responses are returned in full after generation completes.

## Privacy

All processing is local. No data is sent to external services. Documents, embeddings, and indexes are stored in the `data/` and `documents/` directories, which are gitignored.