# JanaBridge AI Integration Contract

This document defines the boundary between the API/Persistence layer (backend) and the AI/RAG engine (core branch).

## Chat Service Interface

The backend defines a pluggable interface `ChatServiceInterface` for message processing. The core AI module MUST implement this interface without modifying the FastAPI routes or SQLite models directly.

### Request Schema (`ChatRequest`)

```json
{
  "message": "What scholarships apply to me?",
  "language": "en",
  "state": "Tamil Nadu",
  "government_scope": "both",
  "selected_document_ids": ["uuid-1", "uuid-2"]
}
```
- `message` (str): The natural language query.
- `language` (str): e.g., "en", "ta", "hi". Defaults to "en".
- `state` (str, optional): e.g., "Tamil Nadu".
- `government_scope` (str, optional): e.g., "state", "central", "both".
- `selected_document_ids` (list[str], optional): Restrict RAG search to these documents.

### Response Schema (`ChatResponse`)

```json
{
  "status": "answered",
  "answer": "You may be eligible for the Adi Dravidar Scholarship...",
  "citations": [
    {
      "citation_id": "cite-uuid",
      "document_id": "doc-uuid",
      "source_title": "Adi Dravidar Guidelines",
      "page": 4,
      "snippet": "Students with attendance above 75%..."
    }
  ],
  "needs_clarification": false,
  "limitations": ["Requires recent income certificate"]
}
```
- `status` (str): `answered`, `insufficient_evidence`, `needs_clarification`, `service_unavailable`.
- `answer` (str): The grounded response text.
- `citations` (list): Verifiable citations mapped to actual chunks.
- `needs_clarification` (bool): True if critical info is missing.
- `limitations` (list[str]): Disclaimers or missing constraints.

## Responsibilities

### Backend (This Branch)
- Manages HTTP endpoints, validation, and CORS.
- Persists conversations, user profiles, and messages in SQLite.
- Manages Document uploads, extraction via PyMuPDF, and storage limits.
- Validates that the core module does not leak fake citations.

### Core (AI/RAG Branch)
- Implements `app.rag.generation.py` or similar to fulfill the `ChatServiceInterface`.
- Manages ChromaDB collections, ingestion workflows, and embedding models.
- Controls Ollama LLM requests and prompt construction.
- Computes BM25 & Hybrid search logic.
- Evaluates evidence sufficiency and prevents hallucinations.
