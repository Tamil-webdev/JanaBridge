"""
Core RAG Engine for BOOKMARK — Privacy-first government-services assistant.

This package provides the complete local Retrieval-Augmented Generation
pipeline.  It does NOT contain HTTP endpoints, FastAPI routes, or a
server entry point.  Those responsibilities belong to the application
layer.

Public interface
----------------
- ``RAGPipeline``   — stateful orchestrator for indexing and querying.
- ``Settings``      — centralised configuration (env-var / .env overrides).
- ``get_settings``  — factory for a fresh ``Settings`` instance.

Quick start (Python)::

    from app.rag import RAGPipeline, get_settings

    settings = get_settings()
    pipeline = RAGPipeline(settings)

    # Index PDFs in the configured documents directory
    result = pipeline.index_documents()

    # Ask a question
    answer = pipeline.query("What are the eligibility criteria?")
"""

from app.rag.config import Settings, get_settings
try:
    from app.rag.rag_pipeline import RAGPipeline
except ImportError:
    RAGPipeline = None  # Mocked or missing dependency


__all__ = [
    "RAGPipeline",
    "Settings",
    "get_settings",
]
