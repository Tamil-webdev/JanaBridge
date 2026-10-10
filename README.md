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