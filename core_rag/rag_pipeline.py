"""
RAG pipeline orchestrator.

Coordinates the full ingestion and query flows:

- **Indexing**: load PDFs → chunk → embed → upsert into ChromaDB +
  rebuild BM25.  Both stores are rebuilt atomically from the current
  corpus so they always represent the same set of chunks.

- **Query**: embed question → hybrid retrieve → relevance gate →
  generate answer → validate citations → return structured response.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path

from core_rag.config import Settings
from core_rag.bm25_retriever import BM25Entry, BM25Index
from core_rag.chunker import Chunk, chunk_pages
from core_rag.embedder import embed_single, embed_texts
from core_rag.generator import generate_answer
from core_rag.pdf_loader import load_all_pdfs
from core_rag.retriever import hybrid_retrieve
from core_rag.vector_store import VectorStore

logger = logging.getLogger(__name__)


@dataclass
class IndexResult:
    """Summary of an indexing run."""
    documents_found: int
    total_pages: int
    total_chunks: int


@dataclass
class QueryResult:
    """Structured result of a RAG query."""
    answer: str
    status: str  # "answered" | "insufficient_evidence"
    citations: list[dict]


class RAGPipeline:
    """Stateful pipeline that holds the vector store and BM25 index."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._vector_store = VectorStore(settings.chroma_path)
        self._bm25_index = BM25Index()

        # Try to load a persisted BM25 index if one exists
        if settings.bm25_path.exists():
            try:
                self._bm25_index.load(settings.bm25_path)
            except Exception:
                logger.warning(
                    "Could not load BM25 index from %s; "
                    "re-index to rebuild.", settings.bm25_path,
                )

    # ------------------------------------------------------------------
    # Indexing
    # ------------------------------------------------------------------

    def index_documents(self, documents_dir: Path | None = None) -> IndexResult:
        """Full rebuild: load all PDFs, chunk, embed, store.

        Both ChromaDB and BM25 are cleared and rebuilt from the same
        chunk list so they are always consistent.
        """
        doc_dir = documents_dir or self.settings.documents_path

        # 1. Load PDFs
        pages = load_all_pdfs(doc_dir)

        # 2. Chunk
        chunks = chunk_pages(
            pages,
            chunk_size=self.settings.chunk_size,
            chunk_overlap=self.settings.chunk_overlap,
        )

        if not chunks:
            raise RuntimeError("Chunking produced zero chunks.")

        # 3. Embed (batched)
        texts = [c.text for c in chunks]
        embeddings = embed_texts(
            texts,
            model=self.settings.embedding_model,
            base_url=self.settings.ollama_base_url,
            batch_size=self.settings.embedding_batch_size,
            timeout=self.settings.ollama_timeout,
        )

        # 4. Clear and rebuild both stores atomically
        self._vector_store.clear()

        ids = [c.chunk_id for c in chunks]
        metadatas = [
            {
                "source_file": c.source_file,
                "page_number": c.page_number,
                "chunk_index": c.chunk_index,
            }
            for c in chunks
        ]
        self._vector_store.upsert(ids, embeddings, metadatas, texts)

        # 5. Rebuild BM25
        bm25_entries = [
            BM25Entry(
                chunk_id=c.chunk_id,
                source_file=c.source_file,
                page_number=c.page_number,
                text=c.text,
            )
            for c in chunks
        ]
        self._bm25_index.build(bm25_entries)
        self._bm25_index.save(self.settings.bm25_path)

        unique_files = {c.source_file for c in chunks}
        logger.info(
            "Indexed %d chunks from %d pages across %d documents",
            len(chunks), len(pages), len(unique_files),
        )
        return IndexResult(
            documents_found=len(unique_files),
            total_pages=len(pages),
            total_chunks=len(chunks),
        )

    # ------------------------------------------------------------------
    # Query
    # ------------------------------------------------------------------

    def query(self, question: str) -> QueryResult:
        """Answer a question using the indexed corpus."""
        if self._vector_store.count == 0:
            return QueryResult(
                answer="No documents have been indexed yet. "
                       "Please index documents first using the "
                       "/api/v1/documents/index endpoint.",
                status="insufficient_evidence",
                citations=[],
            )

        # 1. Embed the question
        q_embedding = embed_single(
            question,
            model=self.settings.embedding_model,
            base_url=self.settings.ollama_base_url,
            timeout=self.settings.ollama_timeout,
        )

        # 2. Hybrid retrieval + relevance check
        chunks, is_relevant = hybrid_retrieve(
            q_embedding,
            question,
            vector_store=self._vector_store,
            bm25_index=self._bm25_index,
            top_k_semantic=self.settings.top_k_semantic,
            top_k_bm25=self.settings.top_k_bm25,
            top_k_final=self.settings.top_k_final,
            rrf_k=self.settings.rrf_k,
            max_semantic_distance=self.settings.max_semantic_distance,
            min_relevant_fraction=self.settings.min_relevant_fraction,
        )

        if not chunks or not is_relevant:
            return QueryResult(
                answer="I do not have sufficient evidence in the "
                       "indexed documents to answer this question.",
                status="insufficient_evidence",
                citations=[],
            )

        # 3. Generate answer with citation validation
        answer, citations, _map = generate_answer(
            question,
            chunks,
            model=self.settings.generation_model,
            base_url=self.settings.ollama_base_url,
            timeout=self.settings.ollama_timeout,
        )

        # 4. Determine final status
        # If the model itself declares insufficient evidence, honour that
        insufficient_markers = [
            "insufficient evidence",
            "do not have sufficient evidence",
            "not enough information",
            "cannot answer",
            "no relevant information",
        ]
        answer_lower = answer.lower()
        is_insufficient = any(m in answer_lower for m in insufficient_markers)

        status = "insufficient_evidence" if is_insufficient else "answered"
        if is_insufficient:
            citations = []  # Don't attach citations to a refusal

        return QueryResult(
            answer=answer,
            status=status,
            citations=citations,
        )
