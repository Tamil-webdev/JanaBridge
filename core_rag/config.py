"""
Centralised configuration for the BOOKMARK core RAG engine.

All paths are resolved as absolute paths relative to the project root
(the parent of the ``core_rag/`` directory), so the engine works
regardless of the current working directory on Windows or Linux.

Every setting can be overridden via environment variables or a ``.env``
file in the project root.
"""

from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings

# Project root: one level above this file's parent directory
# e.g.  core_rag/config.py  →  core_rag/  →  JanaBridge/
_PROJECT_ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Application settings with sensible defaults for local development."""

    # --- Ollama ----------------------------------------------------------
    ollama_base_url: str = "http://localhost:11434"
    generation_model: str = "qwen2.5:3b-instruct"
    embedding_model: str = "qwen3-embedding:0.6b"

    # --- Paths -----------------------------------------------------------
    # Stored as *strings* so Pydantic can deserialise from env-vars;
    # converted to resolved ``Path`` objects via the properties below.
    documents_dir: str = str(_PROJECT_ROOT / "documents")
    chroma_dir: str = str(_PROJECT_ROOT / "data" / "chroma")
    bm25_index_path: str = str(_PROJECT_ROOT / "data" / "bm25_index.pkl")

    # --- Chunking --------------------------------------------------------
    chunk_size: int = 512          # characters per chunk
    chunk_overlap: int = 64        # character overlap between chunks

    # --- Retrieval -------------------------------------------------------
    top_k_semantic: int = 10
    top_k_bm25: int = 10
    top_k_final: int = 5
    rrf_k: int = 60               # constant *k* in 1/(k + rank)

    # --- Relevance thresholds (initial heuristics — tune as needed) ------
    # Maximum cosine distance (ChromaDB returns *distance*, not similarity)
    # for a chunk to be considered potentially relevant.
    # 0.0 = identical, 2.0 = maximally different (for cosine distance).
    max_semantic_distance: float = 1.4

    # Minimum fraction of top-K results that must pass the distance
    # threshold for the query to be considered answerable.
    min_relevant_fraction: float = 0.2

    # --- Embedding batching ----------------------------------------------
    embedding_batch_size: int = 32

    # --- Misc ------------------------------------------------------------
    # HTTP timeout in seconds for Ollama requests
    ollama_timeout: float = 120.0

    model_config = {
        "env_file": str(_PROJECT_ROOT / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }

    # --- Resolved path helpers -------------------------------------------

    @property
    def documents_path(self) -> Path:
        return Path(self.documents_dir).resolve()

    @property
    def chroma_path(self) -> Path:
        return Path(self.chroma_dir).resolve()

    @property
    def bm25_path(self) -> Path:
        return Path(self.bm25_index_path).resolve()


def get_settings() -> Settings:
    """Return a fresh ``Settings`` instance (reads env / .env)."""
    return Settings()
