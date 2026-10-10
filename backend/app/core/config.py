from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "JanaBridge"
    app_version: str = "0.1.0"
    host: str = "127.0.0.1"
    port: int = 8000
    debug: bool = False
    database_url: str = "sqlite:///./data/janabridge.db"
    vector_db_dir: str = "./data/vector_store"
    document_dir: str = "./data/documents"
    ollama_base_url: str = "http://localhost:11434"
    chat_model: str = "llama3"
    embedding_model: str = "nomic-embed-text"
    request_timeout: int = 60
    max_upload_size_mb: int = 10
    max_retrieved_passages: int = 5
    chunk_size: int = 500
    chunk_overlap: int = 50
    min_evidence_threshold: float = 0.5

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
