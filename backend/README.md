# JanaBridge Backend

JanaBridge is a privacy-first, multilingual government-scheme discovery and document-assistance platform.

## Setup Instructions

### 1. Prerequisites
- Python 3.11 or compatible version.

### 2. Create and Activate Virtual Environment (Windows)
Open PowerShell and navigate to the `backend` directory:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Configuration
Copy `.env.example` to `.env` and adjust the variables if needed.
```powershell
Copy-Item .env.example .env
```

### 5. Running the Application
```powershell
uvicorn app.main:app --reload
```
The server will start at `http://127.0.0.1:8000`.
- Health check: `http://127.0.0.1:8000/api/v1/health`
- API documentation: `http://127.0.0.1:8000/docs`

### 6. Running Tests
Execute the tests using pytest:
```powershell
pytest
```

## Document API Examples

JanaBridge supports secure local PDF document uploads and text extraction.

### Upload a PDF
Using PowerShell:
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/documents/" -Method Post -Form @{file=(Get-Item .\sample.pdf)}
```
Using cURL:
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/documents/" -F "file=@sample.pdf"
```
*Note: Maximum upload size defaults to 10 MB and is configurable via `MAX_UPLOAD_SIZE_MB` in `.env`. Only `.pdf` extensions are accepted.*

### Process a Document (Extract Text)
Trigger PyMuPDF text extraction page-by-page. (OCR is not run automatically during this phase).
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/documents/<document_id>/process" -Method Post
```
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/documents/<document_id>/process"
```

### List Documents
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/documents/" -Method Get
```

### Delete a Document
Removes the file from local storage and deletes associated database records.
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/documents/<document_id>" -Method Delete
```

## Conversation & Chat API

JanaBridge supports conversational interactions. Currently, the chat engine is a stub.

### Create a Conversation
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/conversations/" -H "Content-Type: application/json" -d '{"title": "My Application Inquiry"}'
```

### Send a Message
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/conversations/<conversation_id>/messages" \
     -H "Content-Type: application/json" \
     -d '{"message": "What schemes am I eligible for?", "state": "Tamil Nadu", "government_scope": "both"}'
```

### Catalogue APIs
Explore available regions and stub data:
- `GET /api/v1/states/`
- `GET /api/v1/schemes/`
- `GET /api/v1/services/`

## Team Responsibilities & Boundaries

This repository is split between **Backend Persistence** and **Core AI/RAG** logic.

**Backend (this branch):**
- FastAPI routing, schemas, security, configuration.
- SQLite persistence (SQLAlchemy) for Conversations, Messages, and Document uploads.
- PyMuPDF text extraction.

**Core AI (integration branch):**
- ChromaDB, local Embeddings, Ollama inference.
- Implementing the `ChatServiceInterface` for Retrieval-Augmented Generation.
- See `docs/API_CONTRACT.md` for exact interface requirements.
