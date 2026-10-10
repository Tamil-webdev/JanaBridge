from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    app_name: str = "JanaBridge"
    app_version: str = "0.1.0"
    host: str = "127.0.0.1"
    port: int = 8000
    debug: bool = False
    database_url: str = "sqlite:///./data/janabridge.db"

    # RAG Paths
    vector_db_dir: str = str(_PROJECT_ROOT / "data" / "chroma")
    chroma_dir: str | None = None
    document_dir: str = str(_PROJECT_ROOT / "documents")
    documents_dir: str | None = None
    bm25_index_path: str = str(_PROJECT_ROOT / "data" / "bm25_index.pkl")

    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    chat_model: str = "qwen2.5:3b-instruct"
    embedding_model: str = "qwen3-embedding:0.6b"
    generation_model: str = "qwen2.5:3b-instruct"
    ollama_timeout: float = 120.0

    # Misc API settings
    request_timeout: int = 60
    max_upload_size_mb: int = 10

    # Chunking
    chunk_size: int = 512
    chunk_overlap: int = 64

    # Retrieval & Thresholds
    max_retrieved_passages: int = 5
    top_k_semantic: int = 10
    top_k_bm25: int = 10
    top_k_final: int = 5
    rrf_k: int = 60
    max_semantic_distance: float = 1.4
    min_relevant_fraction: float = 0.2
    min_evidence_threshold: float = 0.5
    embedding_batch_size: int = 32

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def documents_path(self) -> Path:
        return Path(self.documents_dir or self.document_dir).resolve()

    @property
    def chroma_path(self) -> Path:
        return Path(self.chroma_dir or self.vector_db_dir).resolve()

    @property
    def bm25_path(self) -> Path:
        return Path(self.bm25_index_path).resolve()

settings = Settings()
