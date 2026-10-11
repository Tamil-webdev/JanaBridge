import sys
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config import settings
from app.rag.rag_pipeline import RAGPipeline

def run_indexing():
    pipeline = RAGPipeline(settings)
    print(f"Indexing documents from {settings.documents_path}...")
    res = pipeline.index_documents()
    print(f"Indexing complete! Documents found: {res.documents_found}, Total chunks: {res.total_chunks}")

if __name__ == "__main__":
    run_indexing()
