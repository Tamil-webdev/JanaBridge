"""Tests for re-indexing consistency.

ChromaDB and BM25 must represent the same corpus after every
index operation.  A full rebuild is acceptable for this milestone.
"""

from __future__ import annotations

import shutil
from pathlib import Path
from unittest.mock import patch

import fitz
import httpx
import pytest

from core_rag.rag_pipeline import RAGPipeline


def _mock_embed_post(*args, **kwargs):
    """Mock Ollama embed endpoint — returns fixed-dimension vectors."""
    request_json = kwargs.get("json") or (args[1] if len(args) > 1 else {})

    # Handle both single text and batch
    if isinstance(request_json, dict):
        body = request_json
    else:
        body = {}

    inputs = body.get("input", [])
    if isinstance(inputs, str):
        inputs = [inputs]

    # Return a unique-ish vector per input (hash-based)
    embeddings = []
    for text in inputs:
        h = hash(text) % 10000
        vec = [float(h % (i + 2)) / 10.0 for i in range(64)]
        embeddings.append(vec)

    return httpx.Response(
        status_code=200,
        json={"embeddings": embeddings},
        request=httpx.Request("POST", "http://localhost:11434/api/embed"),
    )


def _create_pdf(directory: Path, filename: str, text: str) -> Path:
    """Create a single-page PDF with the given text."""
    pdf_path = directory / filename
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((72, 72), text, fontsize=11)
    doc.save(str(pdf_path))
    doc.close()
    return pdf_path


class TestReindexing:
    @patch("core_rag.embedder.httpx.post", side_effect=_mock_embed_post)
    def test_reindex_updates_counts(self, mock_post, test_settings) -> None:
        """Re-indexing after adding a PDF should reflect the new document."""
        pipeline = RAGPipeline(test_settings)

        # First index: 1 PDF (from fixtures)
        result1 = pipeline.index_documents()
        assert result1.documents_found == 1
        count1 = result1.total_chunks

        # Add another PDF
        _create_pdf(
            test_settings.documents_path,
            "extra.pdf",
            "Additional government scheme details for testing.",
        )

        # Re-index: should see 2 documents now
        result2 = pipeline.index_documents()
        assert result2.documents_found == 2
        assert result2.total_chunks > count1

    @patch("core_rag.embedder.httpx.post", side_effect=_mock_embed_post)
    def test_reindex_after_deleting_pdf(self, mock_post, test_settings) -> None:
        """Re-indexing after deleting a PDF should remove its chunks."""
        pipeline = RAGPipeline(test_settings)

        # Add a second PDF and index
        _create_pdf(
            test_settings.documents_path,
            "extra.pdf",
            "Extra document content for testing removal.",
        )
        result1 = pipeline.index_documents()
        assert result1.documents_found == 2

        # Delete the extra PDF
        (test_settings.documents_path / "extra.pdf").unlink()

        # Re-index: full rebuild should show only 1 document
        result2 = pipeline.index_documents()
        assert result2.documents_found == 1
        assert result2.total_chunks < result1.total_chunks

    @patch("core_rag.embedder.httpx.post", side_effect=_mock_embed_post)
    def test_chromadb_and_bm25_consistent(self, mock_post, test_settings) -> None:
        """ChromaDB and BM25 must have the same number of entries."""
        pipeline = RAGPipeline(test_settings)
        result = pipeline.index_documents()

        chroma_count = pipeline._vector_store.count
        bm25_count = pipeline._bm25_index.size

        assert chroma_count == result.total_chunks
        assert bm25_count == result.total_chunks
        assert chroma_count == bm25_count

    @patch("core_rag.embedder.httpx.post", side_effect=_mock_embed_post)
    def test_bm25_persisted_and_loadable(self, mock_post, test_settings) -> None:
        """BM25 index should be saved and loadable across pipeline instances."""
        pipeline1 = RAGPipeline(test_settings)
        pipeline1.index_documents()

        # Create a new pipeline instance — should load persisted BM25
        pipeline2 = RAGPipeline(test_settings)
        assert pipeline2._bm25_index.size > 0
        assert pipeline2._bm25_index.size == pipeline1._bm25_index.size
